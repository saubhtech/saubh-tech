import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { createHash } from 'crypto';
import { execSync } from 'child_process';
import { writeFileSync, readFileSync, unlinkSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const EMPTY_RESULT = { originalText: '', translatedText: '', sourceLang: '', targetLang: '', cached: false, error: false };

@Injectable()
export class CallSubtitleService {
  private readonly logger = new Logger(CallSubtitleService.name);
  private readonly gcpApiKey: string;
  private redis: Redis | null = null;
  private available = false;

  constructor() {
    this.gcpApiKey = process.env.GCP_API_KEY || '';
    if (!this.gcpApiKey) {
      this.logger.warn('GCP_API_KEY not set — live subtitles disabled (calls work normally)');
      return;
    }
    this.available = true;
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || undefined,
        maxRetriesPerRequest: 1,
        retryStrategy: (times) => (times > 2 ? null : Math.min(times * 200, 1000)),
      });
      this.redis.on('error', () => {});
    } catch {
      this.redis = null;
    }
  }

  isAvailable(): boolean {
    return this.available && !!this.gcpApiKey;
  }

  async transcribeAndTranslate(
    audioBase64: string,
    sourceLang: string,
    targetLang: string,
  ) {
    if (!this.available) return { ...EMPTY_RESULT, sourceLang, targetLang };

    try {
      // Step 1: Convert to mono via ffmpeg (fixes stereo/mono mismatch)
      const monoBase64 = this.convertToMono(audioBase64);
      if (!monoBase64) return { ...EMPTY_RESULT, sourceLang, targetLang };

      // Step 2: Speech-to-Text
      const originalText = await this.speechToText(monoBase64, sourceLang);
      if (!originalText || !originalText.trim()) return { ...EMPTY_RESULT, sourceLang, targetLang };

      // Step 3: Skip if same language
      if (sourceLang === targetLang) {
        return { originalText, translatedText: originalText, sourceLang, targetLang, cached: false, error: false };
      }

      // Step 4: Cache check
      const cacheKey = `trans:${sourceLang}:${targetLang}:${createHash('sha256').update(originalText).digest('hex').slice(0, 16)}`;
      try {
        if (this.redis) {
          const cached = await this.redis.get(cacheKey);
          if (cached) return { originalText, translatedText: cached, sourceLang, targetLang, cached: true, error: false };
        }
      } catch {}

      // Step 5: Translate
      const translatedText = await this.translateText(originalText, sourceLang, targetLang);

      // Step 6: Cache
      try { if (this.redis && translatedText) await this.redis.set(cacheKey, translatedText, 'EX', 604800); } catch {}

      return { originalText, translatedText, sourceLang, targetLang, cached: false, error: false };
    } catch (err: any) {
      this.logger.error('Subtitle pipeline failed (non-fatal): ' + err.message);
      return { ...EMPTY_RESULT, sourceLang, targetLang, error: true };
    }
  }

  private convertToMono(audioBase64: string): string | null {
    const id = Date.now() + '_' + Math.random().toString(36).slice(2, 8);
    const inFile = join(tmpdir(), `stt_in_${id}.webm`);
    const outFile = join(tmpdir(), `stt_out_${id}.webm`);
    try {
      writeFileSync(inFile, Buffer.from(audioBase64, 'base64'));
      execSync(`ffmpeg -i ${inFile} -ac 1 -c:a libopus ${outFile} -y 2>/dev/null`, { timeout: 5000 });
      const mono = readFileSync(outFile);
      return mono.toString('base64');
    } catch (err: any) {
      this.logger.warn('FFmpeg mono conversion failed: ' + err.message);
      return null;
    } finally {
      try { unlinkSync(inFile); } catch {}
      try { unlinkSync(outFile); } catch {}
    }
  }

  private async speechToText(audioBase64: string, languageCode: string): Promise<string> {
    try {
      const sttLang = this.mapToSttLang(languageCode);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${this.gcpApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            languageCode: sttLang,
            enableAutomaticPunctuation: true,
            alternativeLanguageCodes: ['en-IN', 'hi-IN'].filter(l => l !== sttLang).slice(0, 3),
          },
          audio: { content: audioBase64 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) {
        const errText = await res.text().catch(() => '');
        this.logger.warn(`STT ${res.status}: ${errText.slice(0, 150)}`);
        return '';
      }
      const data = (await res.json()) as any;
      if (!data.results?.length) return '';
      return data.results.map((r: any) => r.alternatives?.[0]?.transcript || '').join(' ').trim();
    } catch (err: any) {
      this.logger.warn('STT failed: ' + err.message);
      return '';
    }
  }

  private async translateText(text: string, source: string, target: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.gcpApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ q: text, source, target, format: 'text' }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) return text;
      const data = (await res.json()) as any;
      return data.data?.translations?.[0]?.translatedText || text;
    } catch {
      return text;
    }
  }

  private mapToSttLang(lang: string): string {
    const map: Record<string, string> = {
      hi: 'hi-IN', bn: 'bn-IN', ta: 'ta-IN', te: 'te-IN', mr: 'mr-IN',
      gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN',
      en: 'en-IN', ur: 'ur-IN', as: 'as-IN', ne: 'ne-NP',
    };
    return map[lang] || lang + '-IN';
  }
}

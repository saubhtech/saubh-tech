import { Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { createHash } from 'crypto';

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
      this.redis.on('error', () => {}); // Silently handle Redis errors
    } catch {
      this.logger.warn('Redis connection failed for subtitles — caching disabled');
      this.redis = null;
    }
  }

  /** Check if subtitle service is available */
  isAvailable(): boolean {
    return this.available && !!this.gcpApiKey;
  }

  /**
   * Full pipeline: Audio (base64) -> STT -> Translate -> Return subtitle
   * NEVER throws — always returns a result (empty on any failure)
   */
  async transcribeAndTranslate(
    audioBase64: string,
    sourceLang: string,
    targetLang: string,
    encoding: string = 'WEBM_OPUS',
    sampleRateHertz: number = 48000,
  ) {
    if (!this.available) {
      return { ...EMPTY_RESULT, sourceLang, targetLang };
    }

    try {
      // Step 1: Speech-to-Text
      const originalText = await this.speechToText(audioBase64, sourceLang, encoding, sampleRateHertz);
      if (!originalText || originalText.trim().length === 0) {
        return { ...EMPTY_RESULT, sourceLang, targetLang };
      }

      // Step 2: Skip translation if same language
      if (sourceLang === targetLang) {
        return { originalText, translatedText: originalText, sourceLang, targetLang, cached: false, error: false };
      }

      // Step 3: Check Redis cache
      let cached: string | null = null;
      const cacheKey = `trans:${sourceLang}:${targetLang}:${createHash('sha256').update(originalText).digest('hex').slice(0, 16)}`;
      try {
        if (this.redis) cached = await this.redis.get(cacheKey);
      } catch { /* Redis down — skip cache, continue */ }

      if (cached) {
        this.logger.debug(`Cache HIT: ${originalText.slice(0, 30)}`);
        return { originalText, translatedText: cached, sourceLang, targetLang, cached: true, error: false };
      }

      // Step 4: Google Translate
      const translatedText = await this.translateText(originalText, sourceLang, targetLang);

      // Step 5: Cache (best-effort)
      if (translatedText && translatedText !== originalText) {
        try {
          if (this.redis) await this.redis.set(cacheKey, translatedText, 'EX', 604800);
        } catch { /* Cache write failed — not critical */ }
      }

      return { originalText, translatedText, sourceLang, targetLang, cached: false, error: false };
    } catch (err: any) {
      this.logger.error(`Subtitle pipeline failed (non-fatal): ${err.message}`);
      return { ...EMPTY_RESULT, sourceLang, targetLang, error: true };
    }
  }

  private async speechToText(audioBase64: string, languageCode: string, encoding: string, sampleRateHertz: number): Promise<string> {
    try {
      const sttLangCode = this.mapToSttLang(languageCode);
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(`https://speech.googleapis.com/v1/speech:recognize?key=${this.gcpApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            languageCode: sttLangCode,
            enableAutomaticPunctuation: true,
            model: 'default',
            alternativeLanguageCodes: this.getAlternateLanguages(sttLangCode),
          },
          audio: { content: audioBase64 },
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const errBody = await response.text().catch(() => 'no body');
        this.logger.warn(`STT API returned ${response.status}: ${errBody.slice(0, 200)}`);
        return '';
      }
      const result = (await response.json()) as any;
      if (!result.results || result.results.length === 0) return '';
      return result.results.map((r: any) => r.alternatives?.[0]?.transcript || '').join(' ').trim();
    } catch (err: any) {
      if (err.name === 'AbortError') {
        this.logger.warn('STT API timeout (10s)');
      } else {
        this.logger.warn(`STT failed (non-fatal): ${err.message}`);
      }
      return '';
    }
  }

  private async translateText(text: string, sourceLang: string, targetLang: string): Promise<string> {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${this.gcpApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          source: this.mapToGoogleLang(sourceLang),
          target: this.mapToGoogleLang(targetLang),
          format: 'text',
        }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!response.ok) {
        const tErrBody = await response.text().catch(() => 'no body');
        this.logger.warn(`Translation API returned ${response.status}: ${tErrBody.slice(0, 200)}`);
        return text;
      }
      const result = (await response.json()) as any;
      return result.data?.translations?.[0]?.translatedText || text;
    } catch (err: any) {
      if (err.name === 'AbortError') {
        this.logger.warn('Translation API timeout (5s)');
      } else {
        this.logger.warn(`Translation failed (non-fatal): ${err.message}`);
      }
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

  private mapToGoogleLang(lang: string): string {
    return lang;
  }

  private getAlternateLanguages(primary: string): string[] {
    const alts = ['en-IN', 'hi-IN'];
    return alts.filter(a => a !== primary).slice(0, 3);
  }
}

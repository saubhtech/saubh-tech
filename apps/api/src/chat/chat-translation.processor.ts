import { Processor, WorkerHost, InjectQueue } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job, Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service';

export interface ChatTranslationJob {
  enrichmentId: string;
  text: string;
  sourceLang: string;
  targetLang: string;
}

@Processor('chat-translation')
export class ChatTranslationProcessor extends WorkerHost {
  private readonly logger = new Logger(ChatTranslationProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('chat-translation') private readonly chatQueue: Queue,
  ) {
    super();
  }

  async process(job: Job<ChatTranslationJob | any>): Promise<any> {
    if (job.name === 'stt') return this.processSTT(job);
    return this.processTranslation(job);
  }

  private async processSTT(job: Job<any>): Promise<any> {
    const { enrichmentId, roomId, mediaUrl, senderLang } = job.data;
    this.logger.log(`STT processing: enrichment ${enrichmentId}`);

    try {
      // Download audio from MinIO
      const { S3Client, GetObjectCommand } = await import('@aws-sdk/client-s3');
      const s3 = new S3Client({
        endpoint: `http://${process.env.MINIO_ENDPOINT || 'localhost'}:${process.env.MINIO_PORT || '9000'}`,
        region: 'us-east-1',
        credentials: {
          accessKeyId: process.env.MINIO_ACCESS_KEY || 'saubh_minio',
          secretAccessKey: process.env.MINIO_SECRET_KEY || 'MinIOSecure2026Saubh',
        },
        forcePathStyle: true,
      });

      const match = mediaUrl.match(/^minio:\/\/([^/]+)\/(.+)$/);
      if (!match) throw new Error('Invalid media URL');
      const [, bucket, key] = match;

      const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: key }));
      const chunks: Uint8Array[] = [];
      for await (const chunk of res.Body as any) {
        chunks.push(chunk);
      }
      const audioBuffer = Buffer.concat(chunks);

      // Call STT service using raw audio body
      const sttUrl = process.env.STT_URL || 'http://localhost:5070';
      const ext = key.split('.').pop() || 'webm';
      const mimeMap: Record<string, string> = { wav: 'audio/wav', webm: 'audio/webm', ogg: 'audio/ogg', mp3: 'audio/mp3', m4a: 'audio/mp4' };

      const sttRes = await fetch(`${sttUrl}/stt?lang=${senderLang}`, {
        method: 'POST',
        headers: { 'Content-Type': mimeMap[ext] || 'audio/wav' },
        body: audioBuffer,
      });

      if (!sttRes.ok) throw new Error(`STT returned ${sttRes.status}`);
      const sttResult = await sttRes.json() as any;

      if (!sttResult.text) {
        this.logger.warn('STT returned empty text');
        return { success: false, reason: 'empty' };
      }

      // Update enrichment with transcript
      await this.prisma.chatEnrichment.update({
        where: { id: BigInt(enrichmentId) },
        data: {
          originalLang: sttResult.language || senderLang,
          transcriptText: sttResult.text,
          transcriptConfidence: sttResult.confidence || null,
        },
      });

      this.logger.log(`STT complete: "${sttResult.text.slice(0, 50)}..." (${sttResult.language})`);

      // Queue translations for other members
      const members = await this.prisma.chatRoomMember.findMany({
        where: { roomId: BigInt(roomId) },
      });
      const detectedLang = sttResult.language || senderLang;
      const targetLangs = [...new Set(
        members
          .filter(m => m.preferredLang !== detectedLang)
          .map(m => m.preferredLang)
      )];

      for (const targetLang of targetLangs) {
        await this.chatQueue.add('translate', {
          enrichmentId,
          text: sttResult.text,
          sourceLang: detectedLang,
          targetLang,
        }, {
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
        });
      }

      this.logger.log(`Queued ${targetLangs.length} translations for voice note`);
      return { success: true, text: sttResult.text, translations: targetLangs };
    } catch (err: any) {
      this.logger.error(`STT failed: ${err.message}`);
      throw err;
    }
  }

  private async processTranslation(job: Job<ChatTranslationJob>): Promise<any> {
    const { enrichmentId, text, sourceLang, targetLang } = job.data;
    this.logger.log(`Processing translation: ${sourceLang}->${targetLang} for enrichment ${enrichmentId}`);

    try {
      const translationUrl = process.env.TRANSLATION_URL || 'http://localhost:5050';
      const res = await fetch(`${translationUrl}/translate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          texts: [text],
          sourceLang,
          targetLang,
        }),
      });

      if (!res.ok) {
        throw new Error(`Translation API returned ${res.status}`);
      }

      const result = await res.json() as any;
      const translatedText = result.translations?.[0];

      if (!translatedText) {
        throw new Error('No translation returned');
      }

      await this.prisma.chatTranslation.create({
        data: {
          enrichmentId: BigInt(enrichmentId),
          targetLang,
          translatedText,
          engine: result.engines?.[0] || 'indictrans2',
        },
      });

      this.logger.log(`Translation stored: ${sourceLang}->${targetLang} (${result.engines?.[0]})`);
      return { success: true, targetLang, translatedText };
    } catch (err: any) {
      this.logger.error(`Translation failed: ${err.message}`);
      throw err; // BullMQ will retry
    }
  }
}

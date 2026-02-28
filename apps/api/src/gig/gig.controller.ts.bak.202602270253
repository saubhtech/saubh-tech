import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseInterceptors, UploadedFiles,
  ParseIntPipe, BadRequestException,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { GigService } from './gig.service';
import { BigIntInterceptor } from './bigint.interceptor';

const UPLOAD_BASE = '/data/uploads/gig';

function makeStorage(subfolder: string) {
  return diskStorage({
    destination: join(UPLOAD_BASE, subfolder),
    filename: (_req, file, cb) => {
      const ts = Date.now();
      const rand = Math.random().toString(36).substring(2, 8);
      const ext = extname(file.originalname) || '.bin';
      cb(null, `${ts}-${rand}${ext}`);
    },
  });
}

@Controller('gig')
@UseInterceptors(BigIntInterceptor)
export class GigController {
  constructor(private readonly gigService: GigService) {}

  // ── Upload endpoint ──
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const mime = file.mimetype || '';
          let sub = 'documents';
          if (mime.startsWith('audio/')) sub = 'audio';
          else if (mime.startsWith('video/')) sub = 'video';
          cb(null, join(UPLOAD_BASE, sub));
        },
        filename: (_req, file, cb) => {
          const ts = Date.now();
          const rand = Math.random().toString(36).substring(2, 8);
          const ext = extname(file.originalname) || '.bin';
          cb(null, `${ts}-${rand}${ext}`);
        },
      }),
      limits: { fileSize: 200 * 1024 * 1024 }, // 200MB max
      fileFilter: (_req, file, cb) => {
        const allowed = [
          'application/pdf', 'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'image/jpeg', 'image/png', 'image/gif', 'image/webp',
          'audio/webm', 'audio/ogg', 'audio/mpeg', 'audio/wav', 'audio/mp4', 'audio/x-m4a',
          'video/webm', 'video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska',
          'application/octet-stream',
        ];
        const baseMime = (file.mimetype || '').split(';')[0].trim();
        if (allowed.includes(baseMime)) cb(null, true);
        else cb(new BadRequestException(`File type not allowed: ${file.mimetype}`), false);
      },
    }),
  )
  async uploadFiles(@UploadedFiles() files: Express.Multer.File[]) {
    if (!files || files.length === 0) {
      throw new BadRequestException('No files uploaded');
    }
    return files.map(f => {
      const mime = f.mimetype || '';
      let sub = 'documents';
      if (mime.startsWith('audio/')) sub = 'audio';
      else if (mime.startsWith('video/')) sub = 'video';
      return {
        originalName: f.originalname,
        filename: f.filename,
        size: f.size,
        mimetype: f.mimetype,
        url: `/uploads/gig/${sub}/${f.filename}`,
      };
    });
  }

  // ── Sectors / Fields / Market ──
  @Get('sectors')
  async getSectors() { return this.gigService.getSectors(); }

  @Get('fields/:sectorid')
  async getFieldsBySector(@Param('sectorid', ParseIntPipe) sectorid: number) {
    return this.gigService.getFieldsBySector(sectorid);
  }

  @Get('product-service-options')
  async getProductServiceOptions(
    @Query('sectorid', ParseIntPipe) sectorid: number,
    @Query('fieldid', ParseIntPipe) fieldid: number,
  ) { return this.gigService.getProductServiceOptions(sectorid, fieldid); }

  @Get('market-items')
  async getMarketItems(
    @Query('sectorid', ParseIntPipe) sectorid: number,
    @Query('fieldid', ParseIntPipe) fieldid: number,
    @Query('p_s_ps') p_s_ps?: string,
  ) { return this.gigService.getMarketItems(sectorid, fieldid, p_s_ps); }

  // ── Requirements CRUD ──
  @Get('requirements')
  async getRequirements(@Query('userid') userid?: string) {
    return this.gigService.getRequirements(userid ? BigInt(userid) : undefined);
  }

  @Get('requirements/:id')
  async getRequirementById(@Param('id') id: string) {
    return this.gigService.getRequirementById(BigInt(id));
  }

  @Post('requirements')
  async createRequirement(@Body() body: any) {
    return this.gigService.createRequirement({
      userid: BigInt(body.userid),
      marketid: parseInt(body.marketid),
      delivery_mode: body.delivery_mode || undefined,
      requirements: body.requirements || undefined,
      eligibility: body.eligibility || undefined,
      doc_url: body.doc_url || undefined,
      audio_url: body.audio_url || undefined,
      video_url: body.video_url || undefined,
      budget: body.budget ? parseFloat(body.budget) : undefined,
      escrow: body.escrow ? parseFloat(body.escrow) : undefined,
      bidate: body.bidate ? new Date(body.bidate) : undefined,
      delivdate: body.delivdate ? new Date(body.delivdate) : undefined,
    });
  }

  @Put('requirements/:id')
  async updateRequirement(@Param('id') id: string, @Body() body: any) {
    const data: any = {};
    if (body.marketid !== undefined) data.marketid = parseInt(body.marketid);
    if (body.delivery_mode !== undefined) data.delivery_mode = body.delivery_mode;
    if (body.requirements !== undefined) data.requirements = body.requirements;
    if (body.eligibility !== undefined) data.eligibility = body.eligibility;
    if (body.doc_url !== undefined) data.doc_url = body.doc_url;
    if (body.audio_url !== undefined) data.audio_url = body.audio_url;
    if (body.video_url !== undefined) data.video_url = body.video_url;
    if (body.budget !== undefined) data.budget = parseFloat(body.budget);
    if (body.escrow !== undefined) data.escrow = parseFloat(body.escrow);
    if (body.bidate !== undefined) data.bidate = new Date(body.bidate);
    if (body.delivdate !== undefined) data.delivdate = new Date(body.delivdate);
    return this.gigService.updateRequirement(BigInt(id), data);
  }

  @Delete('requirements/:id')
  async deleteRequirement(@Param('id') id: string) {
    return this.gigService.deleteRequirement(BigInt(id));
  }

  // ── Offerings CRUD ──
  @Get('offerings')
  async getOfferings(@Query('userid') userid?: string) {
    return this.gigService.getOfferings(userid ? BigInt(userid) : undefined);
  }

  @Post('offerings')
  async createOffering(@Body() body: any) {
    return this.gigService.createOffering({
      userid: BigInt(body.userid), marketid: parseInt(body.marketid),
      delivery_mode: body.delivery_mode || null, offerings: body.offerings || null,
      doc_url: body.doc_url || null, audio_url: body.audio_url || null, video_url: body.video_url || null,
    });
  }

  @Put('offerings/:id')
  async updateOffering(@Param('id') id: string, @Body() body: any) {
    return this.gigService.updateOffering(BigInt(id), body);
  }

  @Delete('offerings/:id')
  async deleteOffering(@Param('id') id: string) {
    return this.gigService.deleteOffering(BigInt(id));
  }

  // ── Bids CRUD ──
  @Get('bids')
  async getBids(@Query('requirid') requirid?: string) {
    return this.gigService.getBids(requirid ? BigInt(requirid) : undefined);
  }

  @Post('bids')
  async createBid(@Body() body: any) {
    return this.gigService.createBid({
      requirid: BigInt(body.requirid), userid: BigInt(body.userid),
      amount: body.amount ? parseFloat(body.amount) : null,
      escrow: body.escrow ? parseFloat(body.escrow) : undefined,
    });
  }

  @Put('bids/:id')
  async updateBid(@Param('id') id: string, @Body() body: any) {
    return this.gigService.updateBid(BigInt(id), body);
  }

  @Delete('bids/:id')
  async deleteBid(@Param('id') id: string) {
    return this.gigService.deleteBid(BigInt(id));
  }

  // ── Agreements CRUD ──
  @Get('agreements')
  async getAgreements(@Query('bidid') bidid?: string) {
    return this.gigService.getAgreements(bidid ? BigInt(bidid) : undefined);
  }

  @Post('agreements')
  async createAgreement(@Body() body: any) {
    return this.gigService.createAgreement({
      bidid: BigInt(body.bidid), agreement: body.agreement || null,
      client_sign: body.client_sign || null, provider_sign: body.provider_sign || null,
    });
  }

  @Put('agreements/:id')
  async updateAgreement(@Param('id') id: string, @Body() body: any) {
    return this.gigService.updateAgreement(BigInt(id), body);
  }

  @Delete('agreements/:id')
  async deleteAgreement(@Param('id') id: string) {
    return this.gigService.deleteAgreement(BigInt(id));
  }
}

import {
  Controller, Get, Post, Put, Delete, Res,
  Body, Param, Query, UseInterceptors,
  UploadedFile, ParseIntPipe, BadRequestException,
  NotFoundException, StreamableFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { GigService } from './gig.service';
import { BigIntInterceptor } from './bigint.interceptor';

const UPLOAD_DIR = '/data/uploads/gig';

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

@Controller('gig')
@UseInterceptors(BigIntInterceptor)
export class GigController {
  constructor(private readonly gigService: GigService) {}

  // ─── Market Data Endpoints ─────────────────────────────────────
  @Get('sectors')
  async getSectors() {
    return this.gigService.getSectors();
  }

  @Get('fields/:sectorid')
  async getFieldsBySector(@Param('sectorid', ParseIntPipe) sectorid: number) {
    return this.gigService.getFieldsBySector(sectorid);
  }

  @Get('product-service-options')
  async getProductServiceOptions(
    @Query('sectorid', ParseIntPipe) sectorid: number,
    @Query('fieldid', ParseIntPipe) fieldid: number,
  ) {
    return this.gigService.getProductServiceOptions(sectorid, fieldid);
  }

  @Get('market-items')
  async getMarketItems(
    @Query('sectorid', ParseIntPipe) sectorid: number,
    @Query('fieldid', ParseIntPipe) fieldid: number,
    @Query('p_s_ps') p_s_ps?: string,
  ) {
    return this.gigService.getMarketItems(sectorid, fieldid, p_s_ps);
  }

  // ─── File Upload ───────────────────────────────────────────────
  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: (_req, _file, cb) => cb(null, UPLOAD_DIR),
        filename: (_req, file, cb) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          const ext = extname(file.originalname) || '.bin';
          cb(null, `${uniqueSuffix}${ext}`);
        },
      }),
      limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max
      fileFilter: (_req, file, cb) => {
        const allowed = /\.(pdf|doc|docx|jpg|jpeg|png|gif|webp|mp3|wav|ogg|webm|mp4|mov|avi)$/i;
        if (allowed.test(extname(file.originalname))) {
          cb(null, true);
        } else {
          cb(new BadRequestException('File type not allowed'), false);
        }
      },
    }),
  )
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('No file provided');
    return {
      url: `/api/gig/files/${file.filename}`,
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  // ─── Serve uploaded files ──────────────────────────────────────
  @Get('files/:filename')
  getFile(
    @Param('filename') filename: string,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { createReadStream, statSync } = require('fs');
    const filePath = join(UPLOAD_DIR, filename);
    try {
      const stat = statSync(filePath);
      const stream = createReadStream(filePath);
      // Set content type based on extension
      const ext = filename.split('.').pop()?.toLowerCase() || '';
      const mimeMap: Record<string, string> = {
        pdf: 'application/pdf', doc: 'application/msword',
        docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', gif: 'image/gif',
        webp: 'image/webp', mp3: 'audio/mpeg', wav: 'audio/wav', ogg: 'audio/ogg',
        webm: 'video/webm', mp4: 'video/mp4', mov: 'video/quicktime',
      };
      res.set({ 'Content-Type': mimeMap[ext] || 'application/octet-stream' });
      return new StreamableFile(stream, { length: stat.size });
    } catch {
      throw new NotFoundException('File not found');
    }
  }

  // ─── Requirements CRUD ─────────────────────────────────────────
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
    const data = {
      userid: BigInt(body.userid),
      marketid: parseInt(body.marketid),
      delivery_mode: body.delivery_mode || null,
      requirements: body.requirements || null,
      eligibility: body.eligibility || null,
      doc_url: body.doc_url || null,
      audio_url: body.audio_url || null,
      video_url: body.video_url || null,
      budget: body.budget ? parseFloat(body.budget) : undefined,
      escrow: body.escrow ? parseFloat(body.escrow) : undefined,
      bidate: body.bidate ? new Date(body.bidate) : undefined,
      delivdate: body.delivdate ? new Date(body.delivdate) : undefined,
    };
    return this.gigService.createRequirement(data);
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

  // ─── Offerings CRUD ────────────────────────────────────────────
  @Get('offerings')
  async getOfferings(@Query('userid') userid?: string) {
    return this.gigService.getOfferings(userid ? BigInt(userid) : undefined);
  }

  @Post('offerings')
  async createOffering(@Body() body: any) {
    const data = {
      userid: BigInt(body.userid),
      marketid: parseInt(body.marketid),
      delivery_mode: body.delivery_mode || null,
      offerings: body.offerings || null,
      doc_url: body.doc_url || null,
      audio_url: body.audio_url || null,
      video_url: body.video_url || null,
    };
    return this.gigService.createOffering(data);
  }

  @Put('offerings/:id')
  async updateOffering(@Param('id') id: string, @Body() body: any) {
    return this.gigService.updateOffering(BigInt(id), body);
  }

  @Delete('offerings/:id')
  async deleteOffering(@Param('id') id: string) {
    return this.gigService.deleteOffering(BigInt(id));
  }

  // ─── Bids CRUD ─────────────────────────────────────────────────
  @Get('bids')
  async getBids(@Query('requirid') requirid?: string) {
    return this.gigService.getBids(requirid ? BigInt(requirid) : undefined);
  }

  @Post('bids')
  async createBid(@Body() body: any) {
    const data = {
      requirid: BigInt(body.requirid),
      userid: BigInt(body.userid),
      amount: body.amount ? parseFloat(body.amount) : null,
      escrow: body.escrow ? parseFloat(body.escrow) : undefined,
    };
    return this.gigService.createBid(data);
  }

  @Put('bids/:id')
  async updateBid(@Param('id') id: string, @Body() body: any) {
    return this.gigService.updateBid(BigInt(id), body);
  }

  @Delete('bids/:id')
  async deleteBid(@Param('id') id: string) {
    return this.gigService.deleteBid(BigInt(id));
  }

  // ─── Agreements CRUD ───────────────────────────────────────────
  @Get('agreements')
  async getAgreements(@Query('bidid') bidid?: string) {
    return this.gigService.getAgreements(bidid ? BigInt(bidid) : undefined);
  }

  @Post('agreements')
  async createAgreement(@Body() body: any) {
    const data = {
      bidid: BigInt(body.bidid),
      agreement: body.agreement || null,
      client_sign: body.client_sign || null,
      provider_sign: body.provider_sign || null,
    };
    return this.gigService.createAgreement(data);
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

import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, UseInterceptors,
} from '@nestjs/common';
import { BigIntInterceptor } from './bigint.interceptor';
import { GigService } from './gig.service';

const toBigInt = (v: string) => BigInt(v);

@Controller('gig')
@UseInterceptors(BigIntInterceptor)
export class GigController {
  constructor(private readonly gig: GigService) {}

  // Requirements
  @Get('requirements')
  getRequirements(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.gig.getRequirements(Number(page) || 1, Number(limit) || 20);
  }

  @Get('requirements/:id')
  getRequirement(@Param('id') id: string) {
    return this.gig.getRequirement(toBigInt(id));
  }

  @Post('requirements')
  createRequirement(@Body() dto: any) {
    return this.gig.createRequirement({
      userid: BigInt(dto.userid),
      marketid: Number(dto.marketid),
      delivery_mode: dto.delivery_mode || null,
      requirements: dto.requirements || null,
      eligibility: dto.eligibility || null,
      doc_url: dto.doc_url || null,
      audio_url: dto.audio_url || null,
      video_url: dto.video_url || null,
      budget: dto.budget ? Number(dto.budget) : null,
      escrow: dto.escrow ? Number(dto.escrow) : null,
      bidate: dto.bidate ? new Date(dto.bidate) : null,
      delivdate: dto.delivdate ? new Date(dto.delivdate) : null,
    });
  }

  @Put('requirements/:id')
  updateRequirement(@Param('id') id: string, @Body() dto: any) {
    const data: any = {};
    if (dto.marketid !== undefined) data.marketid = Number(dto.marketid);
    if (dto.delivery_mode !== undefined) data.delivery_mode = dto.delivery_mode;
    if (dto.requirements !== undefined) data.requirements = dto.requirements;
    if (dto.eligibility !== undefined) data.eligibility = dto.eligibility;
    if (dto.budget !== undefined) data.budget = dto.budget ? Number(dto.budget) : null;
    if (dto.escrow !== undefined) data.escrow = dto.escrow ? Number(dto.escrow) : null;
    if (dto.bidate !== undefined) data.bidate = dto.bidate ? new Date(dto.bidate) : null;
    if (dto.delivdate !== undefined) data.delivdate = dto.delivdate ? new Date(dto.delivdate) : null;
    return this.gig.updateRequirement(toBigInt(id), data);
  }

  @Delete('requirements/:id')
  @HttpCode(204)
  async deleteRequirement(@Param('id') id: string) {
    await this.gig.deleteRequirement(toBigInt(id));
  }

  // Offerings
  @Get('offerings')
  getOfferings(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.gig.getOfferings(Number(page) || 1, Number(limit) || 20);
  }

  @Get('offerings/:id')
  getOffering(@Param('id') id: string) {
    return this.gig.getOffering(toBigInt(id));
  }

  @Post('offerings')
  createOffering(@Body() dto: any) {
    return this.gig.createOffering({
      userid: BigInt(dto.userid),
      marketid: Number(dto.marketid),
      delivery_mode: dto.delivery_mode || null,
      offerings: dto.offerings || null,
      doc_url: dto.doc_url || null,
      audio_url: dto.audio_url || null,
      video_url: dto.video_url || null,
    });
  }

  @Put('offerings/:id')
  updateOffering(@Param('id') id: string, @Body() dto: any) {
    const data: any = {};
    if (dto.marketid !== undefined) data.marketid = Number(dto.marketid);
    if (dto.delivery_mode !== undefined) data.delivery_mode = dto.delivery_mode;
    if (dto.offerings !== undefined) data.offerings = dto.offerings;
    return this.gig.updateOffering(toBigInt(id), data);
  }

  @Delete('offerings/:id')
  @HttpCode(204)
  async deleteOffering(@Param('id') id: string) {
    await this.gig.deleteOffering(toBigInt(id));
  }

  // Bids
  @Get('bids')
  getBids(@Query('requirid') requirid?: string, @Query('page') page?: string, @Query('limit') limit?: string) {
    return this.gig.getBids(requirid ? toBigInt(requirid) : undefined, Number(page) || 1, Number(limit) || 20);
  }

  @Post('bids')
  createBid(@Body() dto: any) {
    return this.gig.createBid({
      requirid: BigInt(dto.requirid),
      userid: BigInt(dto.userid),
      amount: dto.amount ? Number(dto.amount) : null,
      escrow: dto.escrow ? Number(dto.escrow) : null,
      selected: dto.selected ?? false,
    });
  }

  @Put('bids/:id')
  updateBid(@Param('id') id: string, @Body() dto: any) {
    const data: any = {};
    if (dto.amount !== undefined) data.amount = dto.amount ? Number(dto.amount) : null;
    if (dto.escrow !== undefined) data.escrow = dto.escrow ? Number(dto.escrow) : null;
    if (dto.selected !== undefined) data.selected = dto.selected;
    return this.gig.updateBid(toBigInt(id), data);
  }

  @Delete('bids/:id')
  @HttpCode(204)
  async deleteBid(@Param('id') id: string) {
    await this.gig.deleteBid(toBigInt(id));
  }

  // Agreements
  @Get('agreements')
  getAgreements(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.gig.getAgreements(Number(page) || 1, Number(limit) || 20);
  }

  @Post('agreements')
  createAgreement(@Body() dto: any) {
    return this.gig.createAgreement({
      bidid: BigInt(dto.bidid),
      agreement: dto.agreement || null,
      client_sign: dto.client_sign || null,
      provider_sign: dto.provider_sign || null,
    });
  }

  @Put('agreements/:id')
  updateAgreement(@Param('id') id: string, @Body() dto: any) {
    const data: any = {};
    if (dto.agreement !== undefined) data.agreement = dto.agreement;
    if (dto.client_sign !== undefined) data.client_sign = dto.client_sign;
    if (dto.provider_sign !== undefined) data.provider_sign = dto.provider_sign;
    return this.gig.updateAgreement(toBigInt(id), data);
  }

  @Delete('agreements/:id')
  @HttpCode(204)
  async deleteAgreement(@Param('id') id: string) {
    await this.gig.deleteAgreement(toBigInt(id));
  }
}

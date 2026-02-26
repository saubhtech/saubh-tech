python3 -c "
content = '''import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { GigService } from './gig.service';
import { BigIntInterceptor } from './bigint.interceptor';

@Controller('gig')
@UseInterceptors(BigIntInterceptor)
export class GigController {
  constructor(private readonly gigService: GigService) {}

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
'''
with open('apps/api/src/gig/gig.controller.ts', 'w') as f:
    f.write(content)
print('Written successfully')
"

import {
  Controller, Get, Post, Put, Body, Req, Param, Headers, Query, Res, UploadedFile, UseInterceptors as UseNestInterceptors,
  UseGuards, UseInterceptors, Logger,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { BigIntInterceptor } from '../gig/bigint.interceptor';

@Controller('chat')
@UseInterceptors(BigIntInterceptor)
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post('dm')
  @UseGuards(JwtAuthGuard)
  async createDm(@Req() req: any, @Body() body: { user_b: string }) {
    const userA = BigInt(req.user.sub);
    const userB = BigInt(body.user_b);
    return this.chatService.createDm(userA, userB);
  }

  @Post('group')
  @UseGuards(JwtAuthGuard)
  async createGroup(
    @Req() req: any,
    @Body() body: { title: string; members: string[] },
  ) {
    const creator = BigInt(req.user.sub);
    const members = body.members.map((m: string) => BigInt(m));
    return this.chatService.createGroup(creator, body.title, members);
  }

  @Get('rooms')
  @UseGuards(JwtAuthGuard)
  async getRooms(@Req() req: any) {
    const userId = BigInt(req.user.sub);
    return this.chatService.getUserRooms(userId);
  }

  @Put('prefs')
  @UseGuards(JwtAuthGuard)
  async updatePrefs(
    @Req() req: any,
    @Body() body: { room_id: string; preferred_lang: string },
  ) {
    const userId = BigInt(req.user.sub);
    const roomId = BigInt(body.room_id);
    return this.chatService.updatePrefs(userId, roomId, body.preferred_lang);
  }

  @Post('block')
  @UseGuards(JwtAuthGuard)
  async blockUser(
    @Req() req: any,
    @Body() body: { room_id: string; target_user_id: string },
  ) {
    const blocker = BigInt(req.user.sub);
    const roomId = BigInt(body.room_id);
    const target = BigInt(body.target_user_id);
    return this.chatService.blockUser(blocker, roomId, target);
  }


  @Post('matrix-token')
  @UseGuards(JwtAuthGuard)
  async getMatrixToken(@Req() req: any, @Body() body: { room_id: string }) {
    const userId = BigInt(req.user.sub);
    const accessToken = await this.chatService.getMatrixToken(userId);
    return { access_token: accessToken };
  }

  @Get('messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Req() req: any, @Query('room_id') roomId: string) {
    const userId = BigInt(req.user.sub);
    return this.chatService.getMessages(userId, BigInt(roomId));
  }




  @Post('read')
  @UseGuards(JwtAuthGuard)
  async markRead(@Req() req: any, @Body() body: { room_id: string; event_id: string }) {
    return this.chatService.markRead(BigInt(req.user.sub), BigInt(body.room_id), body.event_id);
  }

  @Get('unread')
  @UseGuards(JwtAuthGuard)
  async getUnread(@Req() req: any) {
    return this.chatService.getUnreadCounts(BigInt(req.user.sub));
  }

  @Post('file/upload')
  @UseGuards(JwtAuthGuard)
  @UseNestInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body() body: { room_id: string },
  ) {
    if (!file) throw new Error('File required');
    const userId = BigInt(req.user.sub);
    const roomId = BigInt(body.room_id);
    return this.chatService.uploadFile(
      userId, roomId, file.buffer, file.mimetype, file.originalname || 'file',
    );
  }

  @Get('file/download')
  @UseGuards(JwtAuthGuard)
  async downloadFile(@Req() req: any, @Query('url') url: string, @Res() res: Response) {
    const { buffer, contentType } = await this.chatService.getFileBuffer(url);
    const filename = url.split('/').pop() || 'file';
    res.set({
      'Content-Type': contentType,
      'Content-Length': buffer.length.toString(),
      'Content-Disposition': `inline; filename="${filename}"`,
    });
    res.send(buffer);
  }

  @Post('voice/upload')
  @UseGuards(JwtAuthGuard)
  @UseNestInterceptors(FileInterceptor('audio'))
  async uploadVoice(
    @Req() req: any,
    @UploadedFile() file: any,
    @Body() body: { room_id: string },
  ) {
    if (!file) throw new Error('Audio file required');
    const userId = BigInt(req.user.sub);
    const roomId = BigInt(body.room_id);
    return this.chatService.uploadVoiceNote(
      userId, roomId, file.buffer, file.mimetype, file.originalname || 'voice.webm',
    );
  }

  @Get('voice/play')
  @UseGuards(JwtAuthGuard)
  async playVoice(@Req() req: any, @Query('url') url: string, @Res() res: Response) {
    const audioBuffer = await this.chatService.getVoiceUrl(url);
    res.set({ 'Content-Type': 'audio/webm', 'Content-Length': audioBuffer.length.toString() });
    res.send(audioBuffer);
  }

  @Put('appservice/_matrix/app/v1/transactions/:txnId')
  async appserviceTransaction(
    @Param('txnId') txnId: string,
    @Headers('authorization') authHeader: string,
    @Body() body: { events: any[] },
    @Query('access_token') queryToken: string,
  ) {
    const expectedToken = process.env.SYNAPSE_HS_TOKEN;
    const provided = queryToken || authHeader?.replace('Bearer ', '');
    if (provided !== expectedToken) {
      this.logger.warn('Appservice: invalid hs_token');
      return {};
    }
    const events = body?.events || [];
    if (events.length > 0) {
      this.logger.log(`Appservice txn ${txnId}: ${events.length} events`);
      await this.chatService.handleAppserviceEvents(txnId, events);
    }
    return {};
  }

}
import { Controller, Get, Post, Query, Body, Req, UseGuards, HttpCode } from '@nestjs/common';
import { CallService } from './call.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat/call')
@UseGuards(JwtAuthGuard)
export class CallController {
  constructor(private readonly callService: CallService) {}

  @Post('token')
  @HttpCode(200)
  async getCallToken(@Req() req: any, @Body() body: { room_id: number }) {
    const userId = req.user.sub || req.user.id;
    return this.callService.generateToken(Number(userId), Number(body.room_id));
  }

  @Get('status')
  async getCallStatus(@Query('room_id') roomId: string) {
    return this.callService.isCallActive(Number(roomId));
  }

  @Get('participants')
  async getParticipants(@Query('room_id') roomId: string) {
    return this.callService.getCallParticipants(Number(roomId));
  }

  @Get('active-rooms')
  async listActiveRooms() {
    return this.callService.listActiveRooms();
  }

  @Get('history')
  async getCallHistory(@Query('room_id') roomId: string, @Query('limit') limit?: string) {
    return this.callService.getCallHistory(Number(roomId), Number(limit) || 20);
  }

  @Get('my-history')
  async getMyCallHistory(@Req() req: any, @Query('limit') limit?: string) {
    const userId = req.user.sub || req.user.id;
    return this.callService.getUserCallHistory(Number(userId), Number(limit) || 30);
  }

  @Post('end')
  @HttpCode(200)
  async endCall(@Req() req: any, @Body() body: { room_id: number }) {
    const userId = req.user.sub || req.user.id;
    await this.callService.endCall(Number(userId), Number(body.room_id));
    return { success: true, message: 'Call ended' };
  }
}

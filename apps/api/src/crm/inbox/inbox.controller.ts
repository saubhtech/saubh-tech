import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Query,
  Body,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import { InboxService } from './inbox.service';

@Controller('crm/conversations')
export class InboxController {

  constructor(private readonly inboxService: InboxService) {}

  // GET /crm/conversations?channelId=xxx&status=OPEN&page=1&limit=25
  @Get()
  listConversations(
    @Query('channelId') channelId?: string,
    @Query('status') status?: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(25), ParseIntPipe) limit?: number,
  ) {
    return this.inboxService.listConversations({ channelId, status, page, limit });
  }

  // GET /crm/conversations/:id/messages?page=1&limit=50
  @Get(':id/messages')
  listMessages(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page?: number,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.inboxService.listMessages(id, { page, limit });
  }

  // POST /crm/conversations/:id/messages — send text
  @Post(':id/messages')
  sendMessage(
    @Param('id') id: string,
    @Body('body') body: string,
    @Body('mediaUrl') mediaUrl?: string,
  ) {
    return this.inboxService.sendMessage(id, body, mediaUrl);
  }

  // POST /crm/conversations/:id/media — send media message
  @Post(':id/media')
  sendMediaMessage(
    @Param('id') id: string,
    @Body('mediaUrl') mediaUrl: string,
    @Body('mediaType') mediaType: 'image' | 'video' | 'audio' | 'document',
    @Body('caption') caption?: string,
    @Body('filename') filename?: string,
  ) {
    return this.inboxService.sendMediaMessage(id, mediaUrl, mediaType, caption, filename);
  }

  // PATCH /crm/conversations/:id/assign
  @Patch(':id/assign')
  assign(
    @Param('id') id: string,
    @Body('userId') userId: number,
  ) {
    return this.inboxService.assign(id, BigInt(userId));
  }

  // PATCH /crm/conversations/:id/resolve
  @Patch(':id/resolve')
  resolve(@Param('id') id: string) {
    return this.inboxService.resolve(id);
  }

  // PATCH /crm/conversations/:id/toggle-bot
  @Patch(':id/toggle-bot')
  toggleBot(@Param('id') id: string) {
    return this.inboxService.toggleBot(id);
  }
}

import { Global, Module } from '@nestjs/common';
import { ChatbotSyncService } from './chatbot-sync.service';

@Global()
@Module({
  providers: [ChatbotSyncService],
  exports: [ChatbotSyncService],
})
export class ChatbotSyncModule {}


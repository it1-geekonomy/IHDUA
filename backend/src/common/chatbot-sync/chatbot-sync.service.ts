import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface ChatbotSyncPayload {
  table: string;
  source_id: string;
  action: 'upsert' | 'delete';
  title?: string;
  content?: string;
  url?: string;
  category?: string;
  slug?: string;
  designation?: string;
}

@Injectable()
export class ChatbotSyncService {
  private readonly logger = new Logger(ChatbotSyncService.name);
  private readonly chatbotUrl: string;
  private readonly apiKey: string;

  constructor(private readonly config: ConfigService) {
    this.chatbotUrl =
      this.config.get<string>('CHATBOT_SERVICE_URL') ||
      process.env.CHATBOT_SERVICE_URL ||
      'http://localhost:8001';
    this.apiKey =
      this.config.get<string>('AI_SERVICE_INTERNAL_KEY') ||
      process.env.AI_SERVICE_INTERNAL_KEY ||
      this.config.get<string>('INTERNAL_API_KEY') ||
      process.env.INTERNAL_API_KEY ||
      '';
  }

  async syncContent(payload: ChatbotSyncPayload): Promise<void> {
    try {
      const res = await fetch(`${this.chatbotUrl}/internal/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Api-Key': this.apiKey,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        this.logger.warn(
          `Chatbot /internal/sync returned HTTP ${res.status} for ${payload.table}#${payload.source_id}`,
        );
      } else {
        this.logger.log(
          `Chatbot synced successfully for ${payload.table}#${payload.source_id} (${payload.action})`,
        );
      }
    } catch (err: any) {
      // Fire-and-forget: failure to reach chatbot should not block CMS operations
      this.logger.warn(
        `Failed to notify chatbot sync service: ${err?.message || err}`,
      );
    }
  }

  async triggerFullSync(force = false): Promise<void> {
    try {
      const res = await fetch(`${this.chatbotUrl}/sync`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Internal-Api-Key': this.apiKey,
        },
        body: JSON.stringify({ force }),
      });

      if (res.ok) {
        this.logger.log(`Chatbot full sync triggered (force=${force})`);
      }
    } catch (err: any) {
      this.logger.warn(`Failed to trigger chatbot full sync: ${err?.message || err}`);
    }
  }
}


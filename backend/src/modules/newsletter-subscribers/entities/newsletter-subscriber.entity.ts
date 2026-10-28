import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

/**
 * Newsletter Subscribers entity mapping to newsletter_subscribers table
 */
@Entity('newsletter_subscribers')
export class NewsletterSubscriber extends BaseEntity {
  @ApiProperty({
    example: 'user@example.com',
    description: 'Subscriber email address',
  })
  @Index('idx_newsletter_subscribers_email')
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @ApiProperty({
    example: true,
    default: true,
    description: 'Whether the subscriber is actively subscribed',
  })
  @Index('idx_newsletter_subscribers_is_active')
  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;
}

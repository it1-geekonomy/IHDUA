import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ImpactInitiative } from '../../impact-initiatives/entities/impact-initiative.entity';

/**
 * ImpactInitiativeStory entity mapping to impact_initiative_stories table
 */
@Entity('impact_initiative_stories')
@Index('idx_initiative_stories', ['initiativeId', 'displayOrder'])
export class ImpactInitiativeStory extends BaseEntity {
  @ApiProperty({
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
    description: 'Associated impact initiative ID',
  })
  @Column({ name: 'initiative_id', type: 'uuid' })
  initiativeId: string;

  @ApiProperty({
    example: 'Empowering Girls through Science Education',
    description: 'Title of the story',
    maxLength: 200,
  })
  @Column({ type: 'varchar', length: 200 })
  title: string;

  @ApiProperty({
    example: 'In rural Chitradurga, the science lab built under this initiative...',
    description: 'Detailed content / story text',
  })
  @Column({ type: 'text' })
  content: string;

  @ApiPropertyOptional({
    example: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/impact-initiative-stories/story-1.jpg',
    description: 'Public image URL for the story',
    maxLength: 500,
    nullable: true,
  })
  @Column({ name: 'image_url', type: 'varchar', length: 500, nullable: true })
  imageUrl?: string | null;

  @ApiProperty({
    example: 1,
    default: 1,
    description: 'Display order for ordering stories within an initiative',
  })
  @Column({ name: 'display_order', type: 'integer', default: 1 })
  displayOrder: number;

  @ManyToOne(() => ImpactInitiative, (initiative) => initiative.stories, {
    onDelete: 'CASCADE',
    nullable: false,
  })
  @JoinColumn({ name: 'initiative_id' })
  initiative?: ImpactInitiative;
}


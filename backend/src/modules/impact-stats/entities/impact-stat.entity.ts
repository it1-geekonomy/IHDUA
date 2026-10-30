import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ImpactCardPosition } from '../../../common/enums/impact-card-position.enum';

@Entity('impact_stats')
export class ImpactStat extends BaseEntity {
  @ApiProperty({
    enum: ImpactCardPosition,
    example: ImpactCardPosition.FIRST,
    description:
      'Card position and theme on the website (FIRST = purple, SECOND = yellow, THIRD = purple, FOURTH = yellow)',
  })
  @Index('idx_impact_stats_card_position')
  @Column({
    type: 'enum',
    enum: ImpactCardPosition,
    enumName: 'impact_card_position',
    name: 'card_position',
  })
  cardPosition: ImpactCardPosition;

  @ApiProperty({
    example: 'Villages Reached',
    description: 'Name/title of the metric',
    maxLength: 150,
  })
  @Column({ name: 'metric_name', type: 'varchar', length: 150 })
  metricName: string;

  @ApiProperty({
    example: '202+',
    description:
      'Formatted string value of the metric (e.g. 202+, 600+, ₹9.14 Cr, 3,487+)',
    maxLength: 50,
  })
  @Column({
    name: 'metric_value',
    type: 'varchar',
    length: 50,
  })
  metricValue: string;
}

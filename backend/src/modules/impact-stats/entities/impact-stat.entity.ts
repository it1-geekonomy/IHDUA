import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ImpactIconType } from '../../../common/enums/impact-icon-type.enum';

@Entity('impact_stats')
export class ImpactStat extends BaseEntity {
  @ApiProperty({
    enum: ImpactIconType,
    example: ImpactIconType.USERS,
    description: 'Icon identifier representing the metric',
  })
  @Index('idx_impact_stats_icon_type')
  @Column({
    type: 'enum',
    enum: ImpactIconType,
    enumName: 'impact_icon_type',
    name: 'icon_type',
  })
  iconType: ImpactIconType;

  @ApiProperty({
    example: 'Lives Impacted',
    description: 'Name/title of the metric',
    maxLength: 150,
  })
  @Column({ name: 'metric_name', type: 'varchar', length: 150 })
  metricName: string;

  @ApiProperty({
    example: 50000,
    description: 'Numeric value of the metric',
  })
  @Column({
    name: 'metric_value',
    type: 'numeric',
    precision: 15,
    scale: 2,
    transformer: {
      to: (value: number) => value,
      from: (value: string) =>
        value !== null && value !== undefined ? parseFloat(value) : value,
    },
  })
  metricValue: number;

  @ApiPropertyOptional({
    example: '+',
    description: 'Optional prefix for the metric (e.g. +, $)',
    maxLength: 10,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  prefix?: string | null;

  @ApiPropertyOptional({
    example: 'K+',
    description: 'Optional suffix for the metric (e.g. +, %, M)',
    maxLength: 10,
    nullable: true,
  })
  @Column({ type: 'varchar', length: 10, nullable: true })
  suffix?: string | null;
}

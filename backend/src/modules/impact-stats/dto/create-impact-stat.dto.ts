import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ImpactIconType } from '../../../common/enums/impact-icon-type.enum';

export class CreateImpactStatDto {
  @ApiProperty({
    enum: ImpactIconType,
    example: ImpactIconType.USERS,
    description: 'Icon identifier representing the metric',
  })
  @IsEnum(ImpactIconType)
  @IsNotEmpty()
  iconType: ImpactIconType;

  @ApiProperty({
    example: 'Lives Impacted',
    description: 'Name/title of the metric',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  metricName: string;

  @ApiProperty({
    example: 50000,
    description: 'Numeric value of the metric',
  })
  @Type(() => Number)
  @IsNumber()
  @IsNotEmpty()
  metricValue: number;

  @ApiPropertyOptional({
    example: '+',
    description: 'Optional prefix for the metric (e.g. +, $)',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  prefix?: string;

  @ApiPropertyOptional({
    example: 'K+',
    description: 'Optional suffix for the metric (e.g. +, %, M)',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  suffix?: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  ValidateIf,
} from 'class-validator';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateInteractiveProgrammeDto {
  @ApiProperty({
    example: 'Rural Health Awareness Camp 2026',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'rural-health-awareness-camp-2026',
    maxLength: 255,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({
    example: 'https://cdn.ihdua.org/interactive-programmes/banner.webp',
    description: 'Existing CDN URL for banner image or video (when not uploading a file)',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  eventMediaUrl?: string | null;

  @ApiPropertyOptional({
    example: '2026-06-15',
    description: 'Event date (YYYY-MM-DD)',
    nullable: true,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsDateString()
  eventDate?: string | null;

  @ApiPropertyOptional({
    example: 'IHDUA Center, Mysore',
    maxLength: 255,
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @MaxLength(255)
  eventLocation?: string | null;

  @ApiPropertyOptional({
    example: '10:00',
    description: 'Event starting time (HH:mm or HH:mm:ss)',
  })
  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((_, value) => value !== null && value !== undefined)
  @IsString()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/, {
    message: 'eventTime must be HH:mm or HH:mm:ss',
  })
  eventTime?: string | null;

  @ApiPropertyOptional({
    example: '<p>Full event description…</p>',
  })
  @IsOptional()
  @IsString()
  content?: string | null;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

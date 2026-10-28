import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateLeadershipMemberDto {
  @ApiProperty({
    example: 'Dr. Jane Doe',
    description: 'Name of the leadership member',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiProperty({
    example: 'Managing Trustee',
    description: 'Designation / role of the leadership member',
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  designation: string;

  @ApiPropertyOptional({
    example:
      'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/leadership-members/member-photo.jpg',
    description:
      'Public CDN URL of the member photo (optional if uploading photo file)',
  })
  @IsOptional()
  @IsString()
  photoUrl?: string;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    description: 'Sort order index for display priority',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
    description: 'Content publication status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

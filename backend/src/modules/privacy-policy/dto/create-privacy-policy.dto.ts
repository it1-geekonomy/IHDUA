import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { SeoFieldsDto } from '../../../common/dto/seo-fields.dto';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreatePrivacyPolicyDto extends SeoFieldsDto {
  @ApiProperty({
    example: 'Privacy Policy',
    description: 'Title of the privacy policy',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: 'This Privacy Policy explains how we collect and use your data...',
    description: 'Full text or HTML content of the privacy policy',
  })
  @IsString()
  @IsNotEmpty()
  content: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.DRAFT,
    description: 'Publication status',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

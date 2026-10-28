import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateLeadershipMemberMultipartDto {
  @ApiProperty({
    example: 'Dr. Jane Doe',
    description: 'Name of the leadership member',
  })
  name: string;

  @ApiProperty({
    example: 'Managing Trustee',
    description: 'Designation / role of the leadership member',
  })
  designation: string;

  @ApiPropertyOptional({
    example: 0,
    default: 0,
    description: 'Sort order index',
  })
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    example: ContentStatus.PUBLISHED,
  })
  status?: ContentStatus;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Member photo image file (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  photo: any;
}

export class UpdateLeadershipMemberMultipartDto {
  @ApiPropertyOptional({
    example: 'Dr. Jane Doe',
    description: 'Name of the leadership member',
  })
  name?: string;

  @ApiPropertyOptional({
    example: 'Managing Trustee',
    description: 'Designation / role of the leadership member',
  })
  designation?: string;

  @ApiPropertyOptional({
    example: 1,
    description: 'Sort order index',
  })
  sortOrder?: number;

  @ApiPropertyOptional({
    enum: ContentStatus,
    example: ContentStatus.PUBLISHED,
  })
  status?: ContentStatus;

  @ApiPropertyOptional({
    type: 'string',
    format: 'binary',
    description:
      'Optional replacement member photo image (JPEG, PNG, WebP, AVIF max 5MB)',
  })
  photo?: any;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class CreateMilestoneDto {
  @ApiProperty({
    example: '1991',
    description: 'Year of the milestone (e.g. 1991, 2005)',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  year: string;

  @ApiProperty({
    example: 'IHDUA established',
    description: 'Description of the milestone',
  })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    enum: ContentStatus,
    default: ContentStatus.DRAFT,
    description: 'Publication status (draft, published, archived)',
  })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

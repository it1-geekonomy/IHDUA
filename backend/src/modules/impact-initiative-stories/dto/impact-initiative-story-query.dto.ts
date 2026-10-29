import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class ImpactInitiativeStoryQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter stories by initiative UUID',
    example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef',
  })
  @IsOptional()
  @IsUUID()
  initiativeId?: string;
}


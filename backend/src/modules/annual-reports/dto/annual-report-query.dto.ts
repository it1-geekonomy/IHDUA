import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class AnnualReportQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by specific report year (e.g. 2025-2026 or 2025)',
    example: '2025-2026',
  })
  @IsOptional()
  @IsString()
  reportYear?: string;
}

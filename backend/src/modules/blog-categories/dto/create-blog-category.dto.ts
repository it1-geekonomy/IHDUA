import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateBlogCategoryDto {
  @ApiProperty({
    example: 'Healthcare & Medical',
    description: 'Name of the blog category',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    example: 'healthcare-and-medical',
    description: 'URL-friendly slug',
    maxLength: 120,
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  slug: string;
}

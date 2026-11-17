import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { ContentStatus } from '../../../common/enums/content-status.enum';

export class FundingComponentDto {
  @ApiProperty({ example: 'Digital Smart Classroom Initiative' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  name: string;

  @ApiProperty({ example: '₹10,00,000' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(40)
  amountLabel: string;

  @ApiPropertyOptional({
    example: '1000000',
    description: 'Digits used to prefill the donation form',
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  amountDigits?: string;
}

export class CreateFundingProjectDto {
  @ApiProperty({ example: 'school-essentials' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  slug: string;

  @ApiProperty({ example: '01' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(10)
  projectNumber: string;

  @ApiProperty({ example: 'School Essentials' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ example: 'Help provide one child with a full year of school essentials.' })
  @IsString()
  @IsNotEmpty()
  summary: string;

  @ApiProperty({ example: '₹20,000 / child / year' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(80)
  totalLabel: string;

  @ApiProperty({
    example: 'School Essentials',
    description: 'donationCategory label for checkout',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  cause: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  highlights?: string[];

  @ApiPropertyOptional({ type: [FundingComponentDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(50)
  @ValidateNested({ each: true })
  @Type(() => FundingComponentDto)
  components?: FundingComponentDto[];

  @ApiPropertyOptional({ example: 1, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @ApiPropertyOptional({ enum: ContentStatus, default: ContentStatus.DRAFT })
  @IsOptional()
  @IsEnum(ContentStatus)
  status?: ContentStatus;
}

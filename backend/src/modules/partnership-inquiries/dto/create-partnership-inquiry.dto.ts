import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { PartnershipType } from '../../../common/enums/partnership-type.enum';

export class CreatePartnershipInquiryDto {
  @ApiProperty({
    example: 'Aditi Rao',
    description: 'Full name of person submitting inquiry',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  yourName: string;

  @ApiProperty({
    example: 'Acme Foundation',
    description: 'Name of the organisation',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  orgName: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Mobile phone number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    enum: PartnershipType,
    example: PartnershipType.CSR_PARTNERSHIP,
    description: 'Type of partnership proposal',
  })
  @IsEnum(PartnershipType)
  @IsNotEmpty()
  partnershipType: PartnershipType;

  @ApiPropertyOptional({
    example: 'We would like to collaborate on rural education and healthcare infrastructure.',
    description: 'Proposal, goals, or areas of collaboration',
  })
  @IsString()
  @IsOptional()
  proposal?: string;
}

export {
  CreatePartnershipInquiryDto as CreateLeadPartnershipDto,
  CreatePartnershipInquiryDto as CreatePartnershipInquiriesDto,
};

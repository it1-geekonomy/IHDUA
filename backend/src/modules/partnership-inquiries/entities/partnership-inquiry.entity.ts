import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PartnershipType } from '../../../common/enums/partnership-type.enum';

/**
 * Partnership Inquiries entity mapping to partnership_inquiries table
 */
@Entity('partnership_inquiries')
export class PartnershipInquiry extends BaseEntity {
  @ApiProperty({ example: 'Aditi Rao', description: 'Full name of person submitting inquiry' })
  @Column({ name: 'your_name', type: 'varchar', length: 255 })
  yourName: string;

  @ApiProperty({ example: 'Acme Foundation', description: 'Name of the organisation' })
  @Column({ name: 'org_name', type: 'varchar', length: 255 })
  orgName: string;

  @ApiProperty({ example: '+919876543210', description: 'Mobile phone number' })
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @ApiProperty({
    enum: PartnershipType,
    example: PartnershipType.CSR_PARTNERSHIP,
    default: PartnershipType.CSR_PARTNERSHIP,
    description: 'Type of partnership proposal',
  })
  @Column({
    name: 'partnership_type',
    type: 'enum',
    enum: PartnershipType,
    enumName: 'partnership_type',
    default: PartnershipType.CSR_PARTNERSHIP,
  })
  partnershipType: PartnershipType;

  @ApiPropertyOptional({
    example: 'We would like to collaborate on rural education and healthcare infrastructure.',
    description: 'Proposal, goals, or areas of collaboration',
  })
  @Column({ type: 'text', nullable: true })
  proposal?: string | null;
}

export { PartnershipInquiry as LeadPartnership, PartnershipInquiry as PartnershipInquiries };

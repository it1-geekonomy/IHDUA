import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { ContactSubject } from '../../../common/enums/contact-subject.enum';

/**
 * Contact Leads entity mapping to leads_contact table
 */
@Entity('leads_contact')
export class LeadContact extends BaseEntity {
  @ApiProperty({ example: 'Ramesh Kumar', description: 'Full name of contact person' })
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @ApiProperty({ example: 'ramesh@example.com', description: 'Email address' })
  @Index('idx_leads_contact_email')
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({ example: '+919876543210', description: 'Mobile phone number' })
  @Column({ type: 'varchar', length: 20 })
  mobile: string;

  @ApiProperty({
    enum: ContactSubject,
    example: ContactSubject.GENERAL_ENQUIRY,
    default: ContactSubject.GENERAL_ENQUIRY,
    description: 'Subject category of the inquiry',
  })
  @Column({
    type: 'enum',
    enum: ContactSubject,
    enumName: 'contact_subject',
    default: ContactSubject.GENERAL_ENQUIRY,
  })
  subject: ContactSubject;

  @ApiProperty({
    example: 'I would like to inquire about your rural education initiatives.',
    description: 'Contact message body',
  })
  @Column({ type: 'text' })
  message: string;
}

export { LeadContact as LeadsContact };

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { VolunteerAreaOfInterest } from '../../../common/enums/volunteer-area-of-interest.enum';

/**
 * Volunteer Inquiries entity mapping to leads_volunteer table
 */
@Entity('leads_volunteer')
export class LeadVolunteer extends BaseEntity {
  @ApiProperty({ example: 'Ananya Sharma', description: 'Full name of volunteer applicant' })
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({ example: 'ananya@example.com', description: 'Email address' })
  @Index('idx_leads_volunteer_email')
  @Column({ type: 'varchar', length: 255 })
  email: string;

  @ApiProperty({ example: '+919876543210', description: 'Mobile phone number' })
  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @ApiProperty({
    enum: VolunteerAreaOfInterest,
    example: VolunteerAreaOfInterest.TEACHING_EDUCATION,
    default: VolunteerAreaOfInterest.TEACHING_EDUCATION,
    description: 'Selected area of interest for volunteering',
  })
  @Column({
    name: 'area_of_interest',
    type: 'enum',
    enum: VolunteerAreaOfInterest,
    enumName: 'volunteer_area_of_interest',
    default: VolunteerAreaOfInterest.TEACHING_EDUCATION,
  })
  areaOfInterest: VolunteerAreaOfInterest;

  @ApiPropertyOptional({
    example: '5 years of primary school teaching experience and content development.',
    description: 'Skills and experience details',
  })
  @Column({ type: 'text', nullable: true })
  skills?: string | null;

  @ApiProperty({
    example: 'https://pub-88ceae84120e4b1b949fe39c82f1cb5f.r2.dev/leads-volunteer/resume.pdf',
    description: 'Public CDN URL of uploaded resume / CV',
  })
  @Column({ name: 'resume_url', type: 'text' })
  resumeUrl: string;
}

export { LeadVolunteer as LeadsVolunteer };

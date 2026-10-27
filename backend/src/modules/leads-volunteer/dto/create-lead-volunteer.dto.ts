import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { VolunteerAreaOfInterest } from '../../../common/enums/volunteer-area-of-interest.enum';

export class CreateLeadVolunteerDto {
  @ApiProperty({ example: 'Ananya Sharma', description: 'Full name of volunteer applicant' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  fullName: string;

  @ApiProperty({ example: 'ananya@example.com', description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({ example: '+919876543210', description: 'Mobile phone number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  phone: string;

  @ApiProperty({
    enum: VolunteerAreaOfInterest,
    example: VolunteerAreaOfInterest.TEACHING_EDUCATION,
    description: 'Selected area of interest for volunteering',
  })
  @IsEnum(VolunteerAreaOfInterest)
  @IsNotEmpty()
  areaOfInterest: VolunteerAreaOfInterest;

  @ApiPropertyOptional({
    example: '5 years of primary school teaching experience and content development.',
    description: 'Skills and experience details',
  })
  @IsOptional()
  @IsString()
  skills?: string;
}

export { CreateLeadVolunteerDto as CreateLeadsVolunteerDto };

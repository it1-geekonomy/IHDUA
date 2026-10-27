import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ContactSubject } from '../../../common/enums/contact-subject.enum';

export class CreateLeadContactDto {
  @ApiProperty({
    example: 'Ramesh Kumar',
    description: 'Full name of the contact person',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    example: 'ramesh@example.com',
    description: 'Email address of the contact person',
  })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: '+919876543210',
    description: 'Mobile phone number',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  mobile: string;

  @ApiProperty({
    enum: ContactSubject,
    example: ContactSubject.GENERAL_ENQUIRY,
    description: 'Subject category of the inquiry',
  })
  @IsEnum(ContactSubject)
  @IsNotEmpty()
  subject: ContactSubject;

  @ApiProperty({
    example: 'I would like to know more about your rural education initiatives.',
    description: 'Detailed message body',
  })
  @IsString()
  @IsNotEmpty()
  message: string;
}

export { CreateLeadContactDto as CreateLeadsContactDto };

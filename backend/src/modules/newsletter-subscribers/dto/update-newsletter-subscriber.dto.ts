import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsEmail, IsOptional, MaxLength } from 'class-validator';

export class UpdateNewsletterSubscriberDto {
  @ApiPropertyOptional({
    example: 'updated@example.com',
    description: 'Updated email address',
  })
  @IsOptional()
  @IsEmail({}, { message: 'Must be a valid email address' })
  @MaxLength(255)
  @Transform(({ value }: { value?: string }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  email?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Active subscription status',
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

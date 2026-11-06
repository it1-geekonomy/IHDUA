import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'Admin User',
    description: 'Display name',
  })
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
    description: 'User role (defaults to ADMIN)',
    default: 'ADMIN',
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  role?: string;

  @ApiProperty({
    example: 'admin@ihdua.org',
    description: 'Unique email address',
  })
  @IsEmail()
  @MaxLength(255)
  email: string;

  @ApiProperty({
    example: 'Admin@123',
    description: 'Plain password (min 8 chars) — hashed on server',
    minLength: 8,
  })
  @IsString()
  @MinLength(8)
  password: string;
}

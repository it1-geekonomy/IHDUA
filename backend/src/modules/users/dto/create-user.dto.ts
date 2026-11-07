import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../../../common/enums/user-role.enum';

export class CreateUserDto {
  @ApiProperty({
    example: 'Admin User',
    description: 'Display name',
  })
  @IsString()
  @MaxLength(255)
  fullName: string;

  @ApiPropertyOptional({
    enum: UserRole,
    example: UserRole.ADMIN,
    description: 'User role (ADMIN or CONTENT, defaults to ADMIN)',
    default: UserRole.ADMIN,
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: 'role must be either ADMIN or CONTENT',
  })
  role?: UserRole;

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

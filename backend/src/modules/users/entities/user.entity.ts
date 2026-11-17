import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'Admin User' })
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.ADMIN, default: UserRole.ADMIN })
  @Index('idx_users_role')
  @Column({ type: 'varchar', length: 50, default: UserRole.ADMIN })
  role: string;

  @ApiProperty({ example: 'admin@ihdua.org' })
  @Index('idx_users_email')
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;
}

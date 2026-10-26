import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'Admin User' })
  @Column({ name: 'full_name', type: 'varchar', length: 255 })
  fullName: string;

  @ApiProperty({ example: 'admin@ihdua.org' })
  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ name: 'password_hash', type: 'text' })
  passwordHash: string;
}

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @ApiProperty({ example: 'a0b1c2d3-e4f5-6789-0123-456789abcdef' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: '2026-10-24T10:00:00.000Z' })
  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @ApiProperty({ example: '2026-10-24T10:00:00.000Z' })
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;

  @ApiPropertyOptional({ example: null })
  @DeleteDateColumn({ name: 'deleted_at', type: 'timestamptz', nullable: true })
  deletedAt?: Date | null;
}

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateDonors1760000000001 implements MigrationInterface {
  name = 'CreateDonors1760000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'donation_status') THEN
          CREATE TYPE donation_status AS ENUM ('pending', 'paid', 'failed', 'refunded');
        END IF;
      END$$;
    `);

    if (await queryRunner.hasTable('donors')) return;

    await queryRunner.createTable(
      new Table({
        name: 'donors',
        columns: [
          idColumn(),
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'pan',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            isNullable: false,
            default: `'INR'`,
          },
          {
            name: 'receipt_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'razorpay_payment_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'razorpay_order_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'donation_status',
            isNullable: false,
            default: `'pending'`,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('donors', [
      new TableIndex({
        name: 'idx_donors_email',
        columnNames: ['email'],
      }),
      new TableIndex({
        name: 'idx_donors_phone',
        columnNames: ['phone'],
      }),
      new TableIndex({
        name: 'idx_donors_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_donors_razorpay_payment_id',
        columnNames: ['razorpay_payment_id'],
      }),
      new TableIndex({
        name: 'idx_donors_razorpay_order_id',
        columnNames: ['razorpay_order_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('donors', true);
    await queryRunner.query(`DROP TYPE IF EXISTS donation_status`);
  }
}

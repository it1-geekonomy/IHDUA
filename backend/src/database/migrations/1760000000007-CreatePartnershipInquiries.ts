import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreatePartnershipInquiries1760000000007 implements MigrationInterface {
  name = 'CreatePartnershipInquiries1760000000007';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Create PostgreSQL ENUM type for partnership_type
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partnership_type') THEN
          CREATE TYPE partnership_type AS ENUM (
            'CSR Partnership',
            'NGO / Non-Profit Collaboration',
            'Academic Partnership',
            'Corporate Partnership',
            'Programme Sponsorship',
            'Infrastructure Development',
            'Other'
          );
        END IF;
      END$$;
    `);

    // Ensure shared PostgreSQL trigger function exists
    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('partnership_inquiries')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'partnership_inquiries',
        columns: [
          idColumn(),
          {
            name: 'your_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'org_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'partnership_type',
            type: 'partnership_type',
            isNullable: false,
            default: `'CSR Partnership'`,
          },
          {
            name: 'proposal',
            type: 'text',
            isNullable: true,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('partnership_inquiries', [
      new TableIndex({
        name: 'idx_partnership_inquiries_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_partnership_inquiries_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    // Attach trigger for auto-updating updated_at
    await addUpdatedAtTrigger(queryRunner, 'partnership_inquiries');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'partnership_inquiries');
    await queryRunner.dropTable('partnership_inquiries', true);
    await queryRunner.query(`DROP TYPE IF EXISTS partnership_type`);
  }
}

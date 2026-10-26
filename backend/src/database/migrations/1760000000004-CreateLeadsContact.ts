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

export class CreateLeadsContact1760000000004 implements MigrationInterface {
  name = 'CreateLeadsContact1760000000004';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Create PostgreSQL ENUM type for contact_subject
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_subject') THEN
          CREATE TYPE contact_subject AS ENUM (
            'General Enquiry',
            'Programme Information',
            'Donation Enquiry',
            'Volunteer Opportunities',
            'Partnership & Collaboration',
            'CSR Projects',
            'Education Programmes',
            'Healthcare Initiatives',
            'Women''s Empowerment',
            'Other'
          );
        END IF;
      END$$;
    `);

    // Ensure shared PostgreSQL trigger function exists
    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('leads_contact')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'leads_contact',
        columns: [
          idColumn(),
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'mobile',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'subject',
            type: 'contact_subject',
            isNullable: false,
            default: `'General Enquiry'`,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: false,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('leads_contact', [
      new TableIndex({
        name: 'idx_leads_contact_email',
        columnNames: ['email'],
      }),
      new TableIndex({
        name: 'idx_leads_contact_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_leads_contact_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    // Attach trigger for auto-updating updated_at
    await addUpdatedAtTrigger(queryRunner, 'leads_contact');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'leads_contact');
    await queryRunner.dropTable('leads_contact', true);
    await queryRunner.query(`DROP TYPE IF EXISTS contact_subject`);
  }
}

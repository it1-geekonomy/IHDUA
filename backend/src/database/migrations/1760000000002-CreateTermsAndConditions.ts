import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateTermsAndConditions1760000000002
  implements MigrationInterface
{
  name = 'CreateTermsAndConditions1760000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'content_status') THEN
          CREATE TYPE content_status AS ENUM ('draft', 'published', 'archived');
        END IF;
      END$$;
    `);

    if (await queryRunner.hasTable('terms_and_conditions')) return;

    await queryRunner.createTable(
      new Table({
        name: 'terms_and_conditions',
        columns: [
          idColumn(),
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'meta_title',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'meta_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'schema_code',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'content_status',
            isNullable: false,
            default: `'draft'`,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'terms_and_conditions',
      new TableIndex({
        name: 'idx_terms_and_conditions_status',
        columnNames: ['status'],
      }),
    );

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'terms_and_conditions');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'terms_and_conditions');
    await queryRunner.dropTable('terms_and_conditions', true);
  }
}

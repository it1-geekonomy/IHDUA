import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateAnnualReports1760000000009
  implements MigrationInterface
{
  name = 'CreateAnnualReports1760000000009';

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

    if (await queryRunner.hasTable('annual_reports')) return;

    await queryRunner.createTable(
      new Table({
        name: 'annual_reports',
        columns: [
          idColumn(),
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'report_year',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'file_url',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'sort_order',
            type: 'integer',
            isNullable: false,
            default: 0,
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

    await queryRunner.createIndices('annual_reports', [
      new TableIndex({
        name: 'idx_annual_reports_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_annual_reports_sort_order',
        columnNames: ['sort_order'],
      }),
    ]);

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'annual_reports');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'annual_reports');
    await queryRunner.dropTable('annual_reports', true);
  }
}

import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateFundingProjects1760000000034 implements MigrationInterface {
  name = 'CreateFundingProjects1760000000034';

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

    if (await queryRunner.hasTable('funding_projects')) return;

    await queryRunner.createTable(
      new Table({
        name: 'funding_projects',
        columns: [
          idColumn(),
          {
            name: 'slug',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'project_number',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'summary',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'total_label',
            type: 'varchar',
            length: '80',
            isNullable: false,
          },
          {
            name: 'cause',
            type: 'varchar',
            length: '120',
            isNullable: false,
          },
          {
            name: 'highlights',
            type: 'jsonb',
            isNullable: false,
            default: `'[]'::jsonb`,
          },
          {
            name: 'presets',
            type: 'jsonb',
            isNullable: false,
            default: `'[]'::jsonb`,
          },
          {
            name: 'components',
            type: 'jsonb',
            isNullable: false,
            default: `'[]'::jsonb`,
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

    await queryRunner.createIndices('funding_projects', [
      new TableIndex({
        name: 'idx_funding_projects_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
      new TableIndex({
        name: 'idx_funding_projects_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_funding_projects_sort_order',
        columnNames: ['sort_order'],
      }),
      new TableIndex({
        name: 'idx_funding_projects_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'funding_projects');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'funding_projects');
    await queryRunner.dropTable('funding_projects', true);
  }
}

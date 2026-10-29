import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableUnique,
} from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateImpactCategories1760000000016 implements MigrationInterface {
  name = 'CreateImpactCategories1760000000016';

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

    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('impact_categories')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'impact_categories',
        columns: [
          idColumn(),
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'display_order',
            type: 'integer',
            isNullable: false,
            default: 1,
          },
          {
            name: 'status',
            type: 'content_status',
            isNullable: false,
            default: `'published'`,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_impact_categories_slug',
            columnNames: ['slug'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('impact_categories', [
      new TableIndex({
        name: 'idx_impact_categories_display_order',
        columnNames: ['display_order'],
      }),
      new TableIndex({
        name: 'idx_impact_categories_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_impact_categories_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_impact_categories_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await addUpdatedAtTrigger(queryRunner, 'impact_categories');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'impact_categories');
    await queryRunner.dropTable('impact_categories', true);
  }
}

import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
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

export class CreateImpactInitiatives1760000000017
  implements MigrationInterface
{
  name = 'CreateImpactInitiatives1760000000017';

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

    if (await queryRunner.hasTable('impact_initiatives')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'impact_initiatives',
        columns: [
          idColumn(),
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '200',
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
            name: 'UQ_impact_initiatives_slug',
            columnNames: ['slug'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_impact_initiatives_category_id',
            columnNames: ['category_id'],
            referencedTableName: 'impact_categories',
            referencedColumnNames: ['id'],
            onDelete: 'RESTRICT',
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('impact_initiatives', [
      new TableIndex({
        name: 'idx_impact_initiatives_category',
        columnNames: ['category_id', 'display_order'],
      }),
      new TableIndex({
        name: 'idx_impact_initiatives_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_impact_initiatives_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_impact_initiatives_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await addUpdatedAtTrigger(queryRunner, 'impact_initiatives');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'impact_initiatives');
    await queryRunner.dropTable('impact_initiatives', true);
  }
}


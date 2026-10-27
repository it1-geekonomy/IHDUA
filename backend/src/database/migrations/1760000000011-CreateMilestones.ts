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

export class CreateMilestones1760000000011 implements MigrationInterface {
  name = 'CreateMilestones1760000000011';

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

    if (await queryRunner.hasTable('milestones')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'milestones',
        columns: [
          idColumn(),
          {
            name: 'year',
            type: 'varchar',
            length: '10',
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: false,
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

    await queryRunner.createIndices('milestones', [
      new TableIndex({
        name: 'idx_milestones_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_milestones_year',
        columnNames: ['year'],
      }),
      new TableIndex({
        name: 'idx_milestones_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_milestones_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await addUpdatedAtTrigger(queryRunner, 'milestones');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'milestones');
    await queryRunner.dropTable('milestones', true);
  }
}

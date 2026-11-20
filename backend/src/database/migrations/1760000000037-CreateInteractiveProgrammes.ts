import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateInteractiveProgrammes1760000000037
  implements MigrationInterface
{
  name = 'CreateInteractiveProgrammes1760000000037';

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

    if (await queryRunner.hasTable('interactive_programmes')) return;

    await queryRunner.createTable(
      new Table({
        name: 'interactive_programmes',
        columns: [
          idColumn(),
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'event_media_url',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'event_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'event_location',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'event_time',
            type: 'time',
            isNullable: true,
          },
          {
            name: 'content',
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

    await queryRunner.createIndices('interactive_programmes', [
      new TableIndex({
        name: 'idx_interactive_programmes_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
      new TableIndex({
        name: 'idx_interactive_programmes_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_interactive_programmes_event_date',
        columnNames: ['event_date'],
      }),
      new TableIndex({
        name: 'idx_interactive_programmes_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'interactive_programmes');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'interactive_programmes');
    await queryRunner.dropTable('interactive_programmes', true);
  }
}

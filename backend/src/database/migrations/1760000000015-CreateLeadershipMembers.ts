import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateLeadershipMembers1760000000015
  implements MigrationInterface
{
  name = 'CreateLeadershipMembers1760000000015';

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

    if (await queryRunner.hasTable('leadership_members')) return;

    await queryRunner.createTable(
      new Table({
        name: 'leadership_members',
        columns: [
          idColumn(),
          {
            name: 'name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'designation',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'photo_url',
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

    await queryRunner.createIndices('leadership_members', [
      new TableIndex({
        name: 'idx_leadership_members_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_leadership_members_sort_order',
        columnNames: ['sort_order'],
      }),
    ]);

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'leadership_members');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'leadership_members');
    await queryRunner.dropTable('leadership_members', true);
  }
}

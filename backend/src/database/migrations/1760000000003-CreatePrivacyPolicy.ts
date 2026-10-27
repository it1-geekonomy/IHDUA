import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreatePrivacyPolicy1760000000003 implements MigrationInterface {
  name = 'CreatePrivacyPolicy1760000000003';

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

    if (await queryRunner.hasTable('privacy_policy')) return;

    await queryRunner.createTable(
      new Table({
        name: 'privacy_policy',
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
      'privacy_policy',
      new TableIndex({
        name: 'idx_privacy_policy_status',
        columnNames: ['status'],
      }),
    );

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'privacy_policy');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'privacy_policy');
    await queryRunner.dropTable('privacy_policy', true);
  }
}

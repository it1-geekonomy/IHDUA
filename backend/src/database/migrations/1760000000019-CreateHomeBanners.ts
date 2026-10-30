import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateHomeBanners1760000000019 implements MigrationInterface {
  name = 'CreateHomeBanners1760000000019';

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

    if (await queryRunner.hasTable('home_banners')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'home_banners',
        columns: [
          idColumn(),
          {
            name: 'title',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'location',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'short_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'banner_image_url',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'mobile_banner_image_url',
            type: 'text',
            isNullable: true,
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
            default: `'draft'`,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('home_banners', [
      new TableIndex({
        name: 'idx_home_banners_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_home_banners_display_order',
        columnNames: ['display_order'],
      }),
      new TableIndex({
        name: 'idx_home_banners_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_home_banners_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await addUpdatedAtTrigger(queryRunner, 'home_banners');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'home_banners');
    await queryRunner.dropTable('home_banners', true);
  }
}

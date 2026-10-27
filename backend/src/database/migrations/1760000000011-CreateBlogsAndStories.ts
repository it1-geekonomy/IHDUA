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

export class CreateBlogsAndStories1760000000011 implements MigrationInterface {
  name = 'CreateBlogsAndStories1760000000011';

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

    if (await queryRunner.hasTable('blogs_and_stories')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'blogs_and_stories',
        columns: [
          idColumn(),
          {
            name: 'category_id',
            type: 'uuid',
            isNullable: true,
          },
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
            name: 'blog_banner',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'blog_date',
            type: 'date',
            isNullable: true,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'short_description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'content_status',
            isNullable: false,
            default: `'draft'`,
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
          ...timestampColumns(),
          softDeleteColumn(),
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_blogs_and_stories_slug',
            columnNames: ['slug'],
          }),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_blogs_and_stories_category_id',
            columnNames: ['category_id'],
            referencedTableName: 'blog_categories',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('blogs_and_stories', [
      new TableIndex({
        name: 'idx_blogs_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_blogs_blog_date',
        columnNames: ['blog_date'],
      }),
      new TableIndex({
        name: 'idx_blogs_category_id',
        columnNames: ['category_id'],
      }),
      new TableIndex({
        name: 'idx_blogs_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'blogs_and_stories');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'blogs_and_stories');
    await queryRunner.dropTable('blogs_and_stories', true);
  }
}

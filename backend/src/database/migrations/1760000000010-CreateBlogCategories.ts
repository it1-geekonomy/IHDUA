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

export class CreateBlogCategories1760000000010 implements MigrationInterface {
  name = 'CreateBlogCategories1760000000010';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    if (await queryRunner.hasTable('blog_categories')) {
      if (await queryRunner.hasColumn('blog_categories', 'status')) {
        await queryRunner.query(`DROP INDEX IF EXISTS "idx_blog_categories_status"`);
        await queryRunner.dropColumn('blog_categories', 'status');
      }
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'blog_categories',
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
            length: '120',
            isNullable: false,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_blog_categories_slug',
            columnNames: ['slug'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('blog_categories', [
      new TableIndex({
        name: 'idx_blog_categories_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await ensureUpdatedAtFunction(queryRunner);
    await addUpdatedAtTrigger(queryRunner, 'blog_categories');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'blog_categories');
    await queryRunner.dropTable('blog_categories', true);
  }
}

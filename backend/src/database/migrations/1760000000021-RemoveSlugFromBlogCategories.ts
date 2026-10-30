import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSlugFromBlogCategories1760000000021 implements MigrationInterface {
  name = 'RemoveSlugFromBlogCategories1760000000021';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "blog_categories" DROP CONSTRAINT IF EXISTS "UQ_blog_categories_slug";
      DROP INDEX IF EXISTS "idx_blog_categories_slug";
      ALTER TABLE "blog_categories" DROP COLUMN IF EXISTS "slug";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "blog_categories" ADD COLUMN IF NOT EXISTS "slug" VARCHAR(120);
      UPDATE "blog_categories"
        SET "slug" = LOWER(REGEXP_REPLACE(TRIM("name"), '[^a-zA-Z0-9]+', '-', 'g'))
        WHERE "slug" IS NULL;
      ALTER TABLE "blog_categories" ALTER COLUMN "slug" SET NOT NULL;
      ALTER TABLE "blog_categories" ADD CONSTRAINT "UQ_blog_categories_slug" UNIQUE ("slug");
    `);
  }
}


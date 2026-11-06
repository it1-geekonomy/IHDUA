import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddVideoToBlogsAndStories1760000000027 implements MigrationInterface {
  name = 'AddVideoToBlogsAndStories1760000000027';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "blogs_and_stories"
        ADD COLUMN IF NOT EXISTS "video" TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "blogs_and_stories"
        DROP COLUMN IF EXISTS "video";
    `);
  }
}

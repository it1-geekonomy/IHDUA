import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContentToImpactInitiatives1760000000026 implements MigrationInterface {
  name = 'AddContentToImpactInitiatives1760000000026';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "impact_initiatives" ADD COLUMN IF NOT EXISTS "content" JSONB`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "impact_initiatives" DROP COLUMN IF EXISTS "content"`,
    );
  }
}

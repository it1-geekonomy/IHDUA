import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSectionsToImpactInitiatives1760000000022 implements MigrationInterface {
  name = 'AddSectionsToImpactInitiatives1760000000022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "impact_initiatives"
        ADD COLUMN IF NOT EXISTS "sections" JSONB NOT NULL DEFAULT '[]'::jsonb;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "impact_initiatives"
        DROP COLUMN IF EXISTS "sections";
    `);
  }
}


import { MigrationInterface, QueryRunner } from 'typeorm';

/** Card shown for each initiative on its category landing page. */
export class AddCardToImpactInitiatives1760000000029
  implements MigrationInterface
{
  name = 'AddCardToImpactInitiatives1760000000029';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "impact_initiatives"
        ADD COLUMN IF NOT EXISTS "card_title" VARCHAR(200),
        ADD COLUMN IF NOT EXISTS "card_image_url" VARCHAR(500)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "impact_initiatives"
        DROP COLUMN IF EXISTS "card_title",
        DROP COLUMN IF EXISTS "card_image_url"
    `);
  }
}

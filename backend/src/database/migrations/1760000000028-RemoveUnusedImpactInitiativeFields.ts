import { MigrationInterface, QueryRunner } from 'typeorm';
import { dropUpdatedAtTrigger } from '../migration.helpers';
import { CreateImpactInitiativeStories1760000000018 } from './1760000000018-CreateImpactInitiativeStories';

export class RemoveUnusedImpactInitiativeFields1760000000028
  implements MigrationInterface
{
  name = 'RemoveUnusedImpactInitiativeFields1760000000028';

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (await queryRunner.hasTable('impact_initiative_stories')) {
      await dropUpdatedAtTrigger(queryRunner, 'impact_initiative_stories');
      await queryRunner.dropTable('impact_initiative_stories', true);
    }

    await queryRunner.query(`
      ALTER TABLE "impact_initiatives"
        DROP COLUMN IF EXISTS "hero_image_alt",
        DROP COLUMN IF EXISTS "card_image_url",
        DROP COLUMN IF EXISTS "card_image_alt",
        DROP COLUMN IF EXISTS "schema_code"
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "impact_initiatives"
        ADD COLUMN IF NOT EXISTS "hero_image_alt" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "card_image_url" VARCHAR(500),
        ADD COLUMN IF NOT EXISTS "card_image_alt" VARCHAR(255),
        ADD COLUMN IF NOT EXISTS "schema_code" TEXT
    `);

    await new CreateImpactInitiativeStories1760000000018().up(queryRunner);
  }
}

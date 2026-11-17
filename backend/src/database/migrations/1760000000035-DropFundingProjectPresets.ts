import { MigrationInterface, QueryRunner } from 'typeorm';

export class DropFundingProjectPresets1760000000035
  implements MigrationInterface
{
  name = 'DropFundingProjectPresets1760000000035';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('funding_projects');
    if (!table) return;
    if (table.findColumnByName('presets')) {
      await queryRunner.dropColumn('funding_projects', 'presets');
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable('funding_projects');
    if (!table) return;
    if (!table.findColumnByName('presets')) {
      await queryRunner.query(`
        ALTER TABLE "funding_projects"
        ADD COLUMN "presets" jsonb NOT NULL DEFAULT '[]'::jsonb
      `);
    }
  }
}

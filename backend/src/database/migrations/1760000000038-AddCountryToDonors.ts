import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCountryToDonors1760000000038 implements MigrationInterface {
  name = 'AddCountryToDonors1760000000038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
        ADD COLUMN IF NOT EXISTS "country_code" VARCHAR(10),
        ADD COLUMN IF NOT EXISTS "country_name" VARCHAR(255);
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_donors_country_code"
        ON "donors" ("country_code");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_donors_country_code"`,
    );
    await queryRunner.query(`
      ALTER TABLE "donors"
        DROP COLUMN IF EXISTS "country_code",
        DROP COLUMN IF EXISTS "country_name";
    `);
  }
}

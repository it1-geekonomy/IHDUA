import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveStateAndPincodeFromDonors1760000000024 implements MigrationInterface {
  name = 'RemoveStateAndPincodeFromDonors1760000000024';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
        DROP COLUMN IF EXISTS "state",
        DROP COLUMN IF EXISTS "pincode";
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
        ADD COLUMN IF NOT EXISTS "state" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "pincode" VARCHAR(20);
    `);
  }
}

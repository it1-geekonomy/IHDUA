import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDonationPdfUrlsToDonors1760000000025 implements MigrationInterface {
  name = 'AddDonationPdfUrlsToDonors1760000000025';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
        ADD COLUMN IF NOT EXISTS "certificate_url" TEXT,
        ADD COLUMN IF NOT EXISTS "receipt_url" TEXT;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
        DROP COLUMN IF EXISTS "certificate_url",
        DROP COLUMN IF EXISTS "receipt_url";
    `);
  }
}

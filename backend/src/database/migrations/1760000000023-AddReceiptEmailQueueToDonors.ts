import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Queue columns for the donation thank-you email (certificate + 80G receipt).
 * Donations paid before this migration keep receipt_email_status NULL, so the
 * queue never emails them retroactively.
 */
export class AddReceiptEmailQueueToDonors1760000000023 implements MigrationInterface {
  name = 'AddReceiptEmailQueueToDonors1760000000023';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
        ADD COLUMN IF NOT EXISTS "receipt_email_status" VARCHAR(20),
        ADD COLUMN IF NOT EXISTS "receipt_email_attempts" INTEGER NOT NULL DEFAULT 0,
        ADD COLUMN IF NOT EXISTS "receipt_email_next_attempt_at" TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS "receipt_email_sent_at" TIMESTAMPTZ,
        ADD COLUMN IF NOT EXISTS "receipt_email_error" TEXT;
    `);
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_donors_receipt_email_queue" ON "donors" ("receipt_email_status");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_donors_receipt_email_queue"`);
    await queryRunner.query(`
      ALTER TABLE "donors"
        DROP COLUMN IF EXISTS "receipt_email_error",
        DROP COLUMN IF EXISTS "receipt_email_sent_at",
        DROP COLUMN IF EXISTS "receipt_email_next_attempt_at",
        DROP COLUMN IF EXISTS "receipt_email_attempts",
        DROP COLUMN IF EXISTS "receipt_email_status";
    `);
  }
}

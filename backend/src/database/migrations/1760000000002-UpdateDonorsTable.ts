import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateDonorsTable1760000000002 implements MigrationInterface {
  name = 'UpdateDonorsTable1760000000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Ensure donation_status enum has 'paid' and 'refunded'
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'paid'
          AND enumtypid = 'donation_status'::regtype
        ) THEN
          ALTER TYPE donation_status ADD VALUE 'paid';
        END IF;

        IF NOT EXISTS (
          SELECT 1 FROM pg_enum
          WHERE enumlabel = 'refunded'
          AND enumtypid = 'donation_status'::regtype
        ) THEN
          ALTER TYPE donation_status ADD VALUE 'refunded';
        END IF;
      END$$;
    `);

    // 2. Migrate any existing 'success' rows to 'paid'
    await queryRunner.query(`
      UPDATE "donors" SET "status" = 'paid' WHERE "status"::text = 'success';
    `);

    // 3. Add new columns to donors table
    await queryRunner.query(`
      ALTER TABLE "donors"
        ADD COLUMN IF NOT EXISTS "address" TEXT,
        ADD COLUMN IF NOT EXISTS "state" VARCHAR(100),
        ADD COLUMN IF NOT EXISTS "pincode" VARCHAR(20),
        ADD COLUMN IF NOT EXISTS "donation_category" VARCHAR(100) NOT NULL DEFAULT 'General Donation';
    `);

    // 4. Update city column length to VARCHAR(100)
    await queryRunner.query(`
      ALTER TABLE "donors" ALTER COLUMN "city" TYPE VARCHAR(100);
    `);

    // 5. Ensure phone and email are NOT NULL
    await queryRunner.query(`
      UPDATE "donors" SET "phone" = '' WHERE "phone" IS NULL;
      ALTER TABLE "donors" ALTER COLUMN "phone" SET NOT NULL;

      UPDATE "donors" SET "email" = '' WHERE "email" IS NULL;
      ALTER TABLE "donors" ALTER COLUMN "email" SET NOT NULL;
    `);

    // 6. Create index on donation_category
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_donors_donation_category" ON "donors" ("donation_category");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_donors_donation_category"`);
    await queryRunner.query(`
      ALTER TABLE "donors"
        DROP COLUMN IF EXISTS "donation_category",
        DROP COLUMN IF EXISTS "pincode",
        DROP COLUMN IF EXISTS "state",
        DROP COLUMN IF EXISTS "address";
    `);
    await queryRunner.query(`
      ALTER TABLE "donors" ALTER COLUMN "city" TYPE VARCHAR(255);
      ALTER TABLE "donors" ALTER COLUMN "phone" DROP NOT NULL;
      ALTER TABLE "donors" ALTER COLUMN "email" DROP NOT NULL;
    `);
  }
}

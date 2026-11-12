import { MigrationInterface, QueryRunner } from 'typeorm';

/** Recurring donations (Razorpay subscriptions); each charge is a `donors` row. */
export class CreateDonationSubscriptions1760000000030 implements MigrationInterface {
  name = 'CreateDonationSubscriptions1760000000030';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "donation_subscriptions" (
        "id" uuid NOT NULL DEFAULT gen_random_uuid(),
        "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP WITH TIME ZONE,
        "full_name" VARCHAR(255) NOT NULL,
        "phone" VARCHAR(20) NOT NULL,
        "email" VARCHAR(255) NOT NULL,
        "pan" VARCHAR(20),
        "address" TEXT,
        "city" VARCHAR(100),
        "message" TEXT,
        "donation_category" VARCHAR(100) NOT NULL DEFAULT 'General Donation',
        "frequency" VARCHAR(20) NOT NULL,
        "amount" NUMERIC(12,2) NOT NULL,
        "currency" VARCHAR(10) NOT NULL DEFAULT 'INR',
        "razorpay_plan_id" VARCHAR(255) NOT NULL,
        "razorpay_subscription_id" VARCHAR(255) NOT NULL,
        "status" VARCHAR(20) NOT NULL DEFAULT 'created',
        "paid_count" INTEGER NOT NULL DEFAULT 0,
        "total_count" INTEGER NOT NULL,
        "next_charge_at" TIMESTAMP WITH TIME ZONE,
        "ended_at" TIMESTAMP WITH TIME ZONE,
        CONSTRAINT "PK_donation_subscriptions_id" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "idx_donation_subscriptions_razorpay_id" ON "donation_subscriptions" ("razorpay_subscription_id")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_donation_subscriptions_status" ON "donation_subscriptions" ("status")`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_donation_subscriptions_email" ON "donation_subscriptions" ("email")`,
    );

    await queryRunner.query(
      `ALTER TABLE "donors" ADD COLUMN IF NOT EXISTS "subscription_id" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "donors" ADD CONSTRAINT "FK_donors_subscription_id" FOREIGN KEY ("subscription_id") REFERENCES "donation_subscriptions"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS "idx_donors_subscription_id" ON "donors" ("subscription_id")`,
    );
    // The checkout handler and the subscription.charged webhook can race to record the same charge.
    await queryRunner.query(
      `CREATE UNIQUE INDEX IF NOT EXISTS "uq_donors_subscription_payment" ON "donors" ("razorpay_payment_id") WHERE "subscription_id" IS NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DROP INDEX IF EXISTS "uq_donors_subscription_payment"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_donors_subscription_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donors" DROP CONSTRAINT IF EXISTS "FK_donors_subscription_id"`,
    );
    await queryRunner.query(
      `ALTER TABLE "donors" DROP COLUMN IF EXISTS "subscription_id"`,
    );
    await queryRunner.query(`DROP TABLE IF EXISTS "donation_subscriptions"`);
  }
}

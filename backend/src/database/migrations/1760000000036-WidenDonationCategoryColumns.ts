import { MigrationInterface, QueryRunner } from 'typeorm';

export class WidenDonationCategoryColumns1760000000036
  implements MigrationInterface
{
  name = 'WidenDonationCategoryColumns1760000000036';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
      ALTER COLUMN "donation_category" TYPE varchar(250)
    `);

    if (await queryRunner.hasTable('donation_subscriptions')) {
      await queryRunner.query(`
        ALTER TABLE "donation_subscriptions"
        ALTER COLUMN "donation_category" TYPE varchar(250)
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "donors"
      ALTER COLUMN "donation_category" TYPE varchar(100)
    `);

    if (await queryRunner.hasTable('donation_subscriptions')) {
      await queryRunner.query(`
        ALTER TABLE "donation_subscriptions"
        ALTER COLUMN "donation_category" TYPE varchar(100)
      `);
    }
  }
}

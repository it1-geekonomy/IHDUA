import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRoleAndIndexesToUsers1760000000031 implements MigrationInterface {
  name = 'AddRoleAndIndexesToUsers1760000000031';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DELETE FROM "migrations" WHERE "name" IN (
        'AddRoleAndIndexesToUsers1760000000026',
        'AddRoleAndIndexesToUsers1760000000029',
        'AddRoleAndIndexesToUsers1760000000030'
      );
      ALTER TABLE "users"
        ADD COLUMN IF NOT EXISTS "role" VARCHAR(50) NOT NULL DEFAULT 'ADMIN';
      CREATE INDEX IF NOT EXISTS "idx_users_email" ON "users"("email");
      CREATE INDEX IF NOT EXISTS "idx_users_role" ON "users"("role");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_users_role";
      DROP INDEX IF EXISTS "idx_users_email";
      ALTER TABLE "users"
        DROP COLUMN IF EXISTS "role";
    `);
  }
}


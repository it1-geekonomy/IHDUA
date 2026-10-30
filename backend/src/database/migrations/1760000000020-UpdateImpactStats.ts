import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImpactStats1760000000020 implements MigrationInterface {
  name = 'UpdateImpactStats1760000000020';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create impact_card_position enum ('first', 'second', 'third', 'fourth')
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'impact_card_position') THEN
          CREATE TYPE impact_card_position AS ENUM (
            'first',
            'second',
            'third',
            'fourth'
          );
        END IF;
      END$$;
    `);

    // 2. Add card_position column
    await queryRunner.query(`
      ALTER TABLE "impact_stats"
        ADD COLUMN IF NOT EXISTS "card_position" impact_card_position NOT NULL DEFAULT 'first';
    `);

    // 3. Drop icon_type index and column
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_impact_stats_icon_type";
      ALTER TABLE "impact_stats" DROP COLUMN IF EXISTS "icon_type";
      DROP TYPE IF EXISTS impact_icon_type;
    `);

    // 4. Alter metric_value column to VARCHAR(50)
    await queryRunner.query(`
      ALTER TABLE "impact_stats"
        ALTER COLUMN "metric_value" TYPE VARCHAR(50) USING "metric_value"::text;
    `);

    // 5. Drop prefix and suffix columns
    await queryRunner.query(`
      ALTER TABLE "impact_stats"
        DROP COLUMN IF EXISTS "prefix",
        DROP COLUMN IF EXISTS "suffix";
    `);

    // 6. Create index on card_position
    await queryRunner.query(`
      CREATE INDEX IF NOT EXISTS "idx_impact_stats_card_position"
        ON "impact_stats" ("card_position");
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // 1. Re-create impact_icon_type enum
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'impact_icon_type') THEN
          CREATE TYPE impact_icon_type AS ENUM (
            'location',
            'users',
            'home',
            'graduation_cap'
          );
        END IF;
      END$$;
    `);

    // 2. Drop card_position index and column
    await queryRunner.query(`
      DROP INDEX IF EXISTS "idx_impact_stats_card_position";
      ALTER TABLE "impact_stats" DROP COLUMN IF EXISTS "card_position";
      DROP TYPE IF EXISTS impact_card_position;
    `);

    // 3. Re-add icon_type column and index
    await queryRunner.query(`
      ALTER TABLE "impact_stats"
        ADD COLUMN IF NOT EXISTS "icon_type" impact_icon_type NOT NULL DEFAULT 'users';
      CREATE INDEX IF NOT EXISTS "idx_impact_stats_icon_type"
        ON "impact_stats" ("icon_type");
    `);

    // 4. Re-add prefix and suffix columns
    await queryRunner.query(`
      ALTER TABLE "impact_stats"
        ADD COLUMN IF NOT EXISTS "prefix" VARCHAR(10),
        ADD COLUMN IF NOT EXISTS "suffix" VARCHAR(10);
    `);

    // 5. Revert metric_value to numeric(15, 2)
    await queryRunner.query(`
      ALTER TABLE "impact_stats"
        ALTER COLUMN "metric_value" TYPE numeric(15, 2)
        USING (CASE WHEN "metric_value" ~ '^[0-9]+(\.[0-9]+)?$' THEN "metric_value"::numeric ELSE 0 END);
    `);
  }
}


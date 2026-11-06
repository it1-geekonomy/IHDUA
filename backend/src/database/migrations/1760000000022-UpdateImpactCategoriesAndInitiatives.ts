import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdateImpactCategoriesAndInitiatives1760000000022
  implements MigrationInterface
{
  name = 'UpdateImpactCategoriesAndInitiatives1760000000022';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'impact_layout_type') THEN
          CREATE TYPE impact_layout_type AS ENUM (
            'education',
            'women_empowerment',
            'skills_employment',
            'model_village',
            'health'
          );
        END IF;
      END$$;
    `);

    // ---------- impact_categories ----------
    await queryRunner.query(`
      ALTER TABLE impact_categories
        ADD COLUMN IF NOT EXISTS layout_type impact_layout_type
    `);

    await queryRunner.query(`
      UPDATE impact_categories
      SET layout_type = CASE slug
        WHEN 'education'             THEN 'education'::impact_layout_type
        WHEN 'women-empowerment'     THEN 'women_empowerment'::impact_layout_type
        WHEN 'skills-and-employment' THEN 'skills_employment'::impact_layout_type
        WHEN 'skills-employment'     THEN 'skills_employment'::impact_layout_type
        WHEN 'model-village'         THEN 'model_village'::impact_layout_type
        WHEN 'health'                THEN 'health'::impact_layout_type
      END
      WHERE layout_type IS NULL
    `);

    await queryRunner.query(`
      DO $$
      DECLARE unmapped text;
      BEGIN
        SELECT string_agg(slug, ', ') INTO unmapped
        FROM impact_categories WHERE layout_type IS NULL;
        IF unmapped IS NOT NULL THEN
          RAISE EXCEPTION 'Set layout_type manually for impact_categories with slug(s): %', unmapped;
        END IF;
      END$$;
    `);

    await queryRunner.query(
      `ALTER TABLE impact_categories ALTER COLUMN layout_type SET NOT NULL`,
    );

    // Slug must be unique only among non-deleted rows so a trashed slug can be reused
    await queryRunner.query(
      `ALTER TABLE impact_categories DROP CONSTRAINT IF EXISTS "UQ_impact_categories_slug"`,
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_impact_categories_slug
        ON impact_categories (slug) WHERE deleted_at IS NULL
    `);

    // ---------- impact_initiatives ----------
    await queryRunner.query(`
      ALTER TABLE impact_initiatives
        ADD COLUMN IF NOT EXISTS published_at       timestamptz,
        ADD COLUMN IF NOT EXISTS hero_title         varchar(255),
        ADD COLUMN IF NOT EXISTS hero_description   text,
        ADD COLUMN IF NOT EXISTS hero_image_url        varchar(500),
        ADD COLUMN IF NOT EXISTS hero_image_mobile_url varchar(500),
        ADD COLUMN IF NOT EXISTS hero_image_alt     varchar(255),
        ADD COLUMN IF NOT EXISTS card_image_url     varchar(500),
        ADD COLUMN IF NOT EXISTS card_image_alt     varchar(255),
        ADD COLUMN IF NOT EXISTS meta_title         varchar(255),
        ADD COLUMN IF NOT EXISTS meta_description   text,
        ADD COLUMN IF NOT EXISTS schema_code        text
    `);

    await queryRunner.query(`
      UPDATE impact_initiatives
      SET published_at = created_at
      WHERE status = 'published' AND published_at IS NULL
    `);

    await queryRunner.query(
      `ALTER TABLE impact_initiatives DROP CONSTRAINT IF EXISTS "UQ_impact_initiatives_slug"`,
    );
    await queryRunner.query(`
      CREATE UNIQUE INDEX IF NOT EXISTS uq_impact_initiatives_slug
        ON impact_initiatives (slug) WHERE deleted_at IS NULL
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX IF EXISTS uq_impact_initiatives_slug`);
    await queryRunner.query(`
      ALTER TABLE impact_initiatives
        ADD CONSTRAINT "UQ_impact_initiatives_slug" UNIQUE (slug)
    `);
    await queryRunner.query(`
      ALTER TABLE impact_initiatives
        DROP COLUMN IF EXISTS published_at,
        DROP COLUMN IF EXISTS hero_title,
        DROP COLUMN IF EXISTS hero_description,
        DROP COLUMN IF EXISTS hero_image_url,
        DROP COLUMN IF EXISTS hero_image_mobile_url,
        DROP COLUMN IF EXISTS hero_image_alt,
        DROP COLUMN IF EXISTS card_image_url,
        DROP COLUMN IF EXISTS card_image_alt,
        DROP COLUMN IF EXISTS meta_title,
        DROP COLUMN IF EXISTS meta_description,
        DROP COLUMN IF EXISTS schema_code
    `);

    await queryRunner.query(`DROP INDEX IF EXISTS uq_impact_categories_slug`);
    await queryRunner.query(`
      ALTER TABLE impact_categories
        ADD CONSTRAINT "UQ_impact_categories_slug" UNIQUE (slug)
    `);
    await queryRunner.query(
      `ALTER TABLE impact_categories DROP COLUMN IF EXISTS layout_type`,
    );
    await queryRunner.query(`DROP TYPE IF EXISTS impact_layout_type`);
  }
}

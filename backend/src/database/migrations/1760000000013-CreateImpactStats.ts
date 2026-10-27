import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateImpactStats1760000000013 implements MigrationInterface {
  name = 'CreateImpactStats1760000000013';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

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

    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('impact_stats')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'impact_stats',
        columns: [
          idColumn(),
          {
            name: 'icon_type',
            type: 'impact_icon_type',
            isNullable: false,
          },
          {
            name: 'metric_name',
            type: 'varchar',
            length: '150',
            isNullable: false,
          },
          {
            name: 'metric_value',
            type: 'numeric',
            precision: 15,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'prefix',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          {
            name: 'suffix',
            type: 'varchar',
            length: '10',
            isNullable: true,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('impact_stats', [
      new TableIndex({
        name: 'idx_impact_stats_icon_type',
        columnNames: ['icon_type'],
      }),
      new TableIndex({
        name: 'idx_impact_stats_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_impact_stats_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await addUpdatedAtTrigger(queryRunner, 'impact_stats');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'impact_stats');
    await queryRunner.dropTable('impact_stats', true);
  }
}

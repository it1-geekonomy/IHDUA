import { QueryRunner, TableColumnOptions, TableIndexOptions } from 'typeorm';

/** UUID primary key column — standard on every table */
export function idColumn(): TableColumnOptions {
  return {
    name: 'id',
    type: 'uuid',
    isPrimary: true,
    isNullable: false,
    generationStrategy: 'uuid',
    default: 'gen_random_uuid()',
  };
}

/** Standard timestamp columns for all tables */
export function timestampColumns(): TableColumnOptions[] {
  return [
    {
      name: 'created_at',
      type: 'timestamptz',
      isNullable: false,
      default: 'CURRENT_TIMESTAMP',
    },
    {
      name: 'updated_at',
      type: 'timestamptz',
      isNullable: false,
      default: 'CURRENT_TIMESTAMP',
    },
  ];
}

/** Soft-delete column for tables supporting soft deletion */
export function softDeleteColumn(): TableColumnOptions {
  return {
    name: 'deleted_at',
    type: 'timestamptz',
    isNullable: true,
  };
}

export function statusIndex(table: string): TableIndexOptions {
  return {
    name: `idx_${table}_status`,
    columnNames: ['status'],
  };
}

/** Shared Postgres function for updated_at trigger */
export async function ensureUpdatedAtFunction(
  queryRunner: QueryRunner,
): Promise<void> {
  await queryRunner.query(`
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = CURRENT_TIMESTAMP;
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);
}

/** BEFORE UPDATE trigger — attach to tables to auto-update updated_at */
export async function addUpdatedAtTrigger(
  queryRunner: QueryRunner,
  table: string,
): Promise<void> {
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS update_${table}_updated_at ON "${table}"`,
  );
  await queryRunner.query(`
    CREATE TRIGGER update_${table}_updated_at
    BEFORE UPDATE ON "${table}"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
  `);
}

export async function dropUpdatedAtTrigger(
  queryRunner: QueryRunner,
  table: string,
): Promise<void> {
  await queryRunner.query(
    `DROP TRIGGER IF EXISTS update_${table}_updated_at ON "${table}"`,
  );
}

import { MigrationInterface, QueryRunner, Table, TableUnique } from 'typeorm';
import {
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateUsers1760000000000 implements MigrationInterface {
  name = 'CreateUsers1760000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    if (await queryRunner.hasTable('users')) return;

    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          idColumn(),
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'password_hash',
            type: 'text',
            isNullable: false,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_users_email',
            columnNames: ['email'],
          }),
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}

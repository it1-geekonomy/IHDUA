import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableUnique,
} from 'typeorm';
import {
  addUpdatedAtTrigger,
  dropUpdatedAtTrigger,
  ensureUpdatedAtFunction,
  idColumn,
  softDeleteColumn,
  timestampColumns,
} from '../migration.helpers';

export class CreateNewsletterSubscribers1760000000014
  implements MigrationInterface
{
  name = 'CreateNewsletterSubscribers1760000000014';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Ensure shared PostgreSQL trigger function exists
    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('newsletter_subscribers')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'newsletter_subscribers',
        columns: [
          idColumn(),
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'is_active',
            type: 'boolean',
            isNullable: false,
            default: true,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
        uniques: [
          new TableUnique({
            name: 'UQ_newsletter_subscribers_email',
            columnNames: ['email'],
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('newsletter_subscribers', [
      new TableIndex({
        name: 'idx_newsletter_subscribers_email',
        columnNames: ['email'],
      }),
      new TableIndex({
        name: 'idx_newsletter_subscribers_is_active',
        columnNames: ['is_active'],
      }),
      new TableIndex({
        name: 'idx_newsletter_subscribers_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_newsletter_subscribers_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    // Attach trigger for auto-updating updated_at
    await addUpdatedAtTrigger(queryRunner, 'newsletter_subscribers');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'newsletter_subscribers');
    await queryRunner.dropTable('newsletter_subscribers', true);
  }
}

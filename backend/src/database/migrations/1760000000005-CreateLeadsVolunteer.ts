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

export class CreateLeadsVolunteer1760000000005 implements MigrationInterface {
  name = 'CreateLeadsVolunteer1760000000005';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    // Create PostgreSQL ENUM type for volunteer_area_of_interest
    await queryRunner.query(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'volunteer_area_of_interest') THEN
          CREATE TYPE volunteer_area_of_interest AS ENUM (
            'Teaching & Education',
            'Healthcare & Medical Camps',
            'Community Outreach',
            'Women Empowerment',
            'Agriculture & Sustainability',
            'Youth Development',
            'Event Support',
            'Design & Digital Marketing',
            'Administration & Operations',
            'Other'
          );
        END IF;
      END$$;
    `);

    // Ensure shared PostgreSQL trigger function exists
    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('leads_volunteer')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'leads_volunteer',
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
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: false,
          },
          {
            name: 'area_of_interest',
            type: 'volunteer_area_of_interest',
            isNullable: false,
            default: `'Teaching & Education'`,
          },
          {
            name: 'skills',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'resume_url',
            type: 'text',
            isNullable: false,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('leads_volunteer', [
      new TableIndex({
        name: 'idx_leads_volunteer_email',
        columnNames: ['email'],
      }),
      new TableIndex({
        name: 'idx_leads_volunteer_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_leads_volunteer_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    // Attach trigger for auto-updating updated_at
    await addUpdatedAtTrigger(queryRunner, 'leads_volunteer');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'leads_volunteer');
    await queryRunner.dropTable('leads_volunteer', true);
    await queryRunner.query(`DROP TYPE IF EXISTS volunteer_area_of_interest`);
  }
}

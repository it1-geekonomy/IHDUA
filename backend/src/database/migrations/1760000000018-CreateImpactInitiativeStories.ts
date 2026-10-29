import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
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

export class CreateImpactInitiativeStories1760000000018
  implements MigrationInterface
{
  name = 'CreateImpactInitiativeStories1760000000018';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pgcrypto"`);

    await ensureUpdatedAtFunction(queryRunner);

    if (await queryRunner.hasTable('impact_initiative_stories')) {
      return;
    }

    await queryRunner.createTable(
      new Table({
        name: 'impact_initiative_stories',
        columns: [
          idColumn(),
          {
            name: 'initiative_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '200',
            isNullable: false,
          },
          {
            name: 'content',
            type: 'text',
            isNullable: false,
          },
          {
            name: 'image_url',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'display_order',
            type: 'integer',
            isNullable: false,
            default: 1,
          },
          ...timestampColumns(),
          softDeleteColumn(),
        ],
        foreignKeys: [
          new TableForeignKey({
            name: 'FK_impact_initiative_stories_initiative_id',
            columnNames: ['initiative_id'],
            referencedTableName: 'impact_initiatives',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
          }),
        ],
      }),
      true,
    );

    await queryRunner.createIndices('impact_initiative_stories', [
      new TableIndex({
        name: 'idx_initiative_stories',
        columnNames: ['initiative_id', 'display_order'],
      }),
      new TableIndex({
        name: 'idx_impact_initiative_stories_created_at',
        columnNames: ['created_at'],
      }),
      new TableIndex({
        name: 'idx_impact_initiative_stories_deleted_at',
        columnNames: ['deleted_at'],
      }),
    ]);

    await addUpdatedAtTrigger(queryRunner, 'impact_initiative_stories');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await dropUpdatedAtTrigger(queryRunner, 'impact_initiative_stories');
    await queryRunner.dropTable('impact_initiative_stories', true);
  }
}


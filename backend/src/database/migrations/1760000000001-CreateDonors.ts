import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
} from 'typeorm';

export class CreateDonors1760000000001 implements MigrationInterface {
  name = 'CreateDonors1760000000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE donation_status AS ENUM ('pending', 'success', 'failed')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'donors',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'gen_random_uuid()',
          },
          {
            name: 'full_name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'city',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'pan',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'message',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'amount',
            type: 'numeric',
            precision: 12,
            scale: 2,
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '10',
            isNullable: false,
            default: `'INR'`,
          },
          {
            name: 'receipt_number',
            type: 'varchar',
            length: '50',
            isNullable: true,
          },
          {
            name: 'razorpay_payment_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'razorpay_order_id',
            type: 'varchar',
            length: '255',
            isNullable: true,
          },
          {
            name: 'status',
            type: 'donation_status',
            isNullable: false,
            default: `'pending'`,
          },
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
        ],
      }),
      true,
    );

    await queryRunner.createIndices('donors', [
      new TableIndex({
        name: 'idx_donors_email',
        columnNames: ['email'],
      }),
      new TableIndex({
        name: 'idx_donors_phone',
        columnNames: ['phone'],
      }),
      new TableIndex({
        name: 'idx_donors_status',
        columnNames: ['status'],
      }),
      new TableIndex({
        name: 'idx_donors_razorpay_payment_id',
        columnNames: ['razorpay_payment_id'],
      }),
      new TableIndex({
        name: 'idx_donors_razorpay_order_id',
        columnNames: ['razorpay_order_id'],
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('donors');
    await queryRunner.query(`DROP TYPE donation_status`);
  }
}

import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { transactionWrapper } from '../utils';

const tableName = 'entry';
const columnName = 'schedule_id';

export class AddScheduleIdColumnToEntryTable1647527327913 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({ name: columnName, type: 'integer', isNullable: true, isUnique: true });
    await transactionWrapper(queryRunner, async () => queryRunner.addColumn(tableName, column));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropColumn(tableName, columnName));
  }
}

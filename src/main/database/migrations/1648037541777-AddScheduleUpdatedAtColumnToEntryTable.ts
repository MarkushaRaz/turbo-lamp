import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { transactionWrapper } from '../utils';

const tableName = 'entry';
const columnName = 'schedule_updated_at';

export class AddScheduleUpdatedAtColumnToEntryTable1648037541777 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({ name: columnName, type: 'datetime', isNullable: true, precision: 3 });
    await transactionWrapper(queryRunner, async () => queryRunner.addColumn(tableName, column));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropColumn(tableName, columnName));
  }
}

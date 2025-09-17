import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { transactionWrapper } from '../utils';

const tableName = 'entry';
const columnName = 'is_updated';

export class AddIsUpdatedColumnToEntryTable1685610003012 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({ name: columnName, type: 'boolean', default: false });
    await transactionWrapper(queryRunner, async () => queryRunner.addColumn(tableName, column));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropColumn(tableName, columnName));
  }
}

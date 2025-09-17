import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { transactionWrapper } from '../utils';

const tableName = 'entry';
const columnName = 'is_dual';

export class RemoveIsDualColumnFromEntryTable1648121399586 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropColumn(tableName, columnName));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({ name: columnName, type: 'boolean', isNullable: false });
    await transactionWrapper(queryRunner, async () => queryRunner.addColumn(tableName, column));
  }
}

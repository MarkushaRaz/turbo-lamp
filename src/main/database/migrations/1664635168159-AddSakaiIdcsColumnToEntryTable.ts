import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { transactionWrapper } from '../utils';

const tableName = 'entry';
const columnName = 'sakai_idcs';

export class AddSakaiIdcsColumnToEntryTable1664635168159 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({ name: columnName, type: 'varchar', isNullable: true });
    await transactionWrapper(queryRunner, async () => queryRunner.addColumn(tableName, column));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropColumn(tableName, columnName));
  }
}

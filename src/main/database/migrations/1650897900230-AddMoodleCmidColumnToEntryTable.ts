import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';
import { transactionWrapper } from '../utils';

const tableName = 'entry';
const columnName = 'moodle_cmid';

export class AddMoodleCmidColumnToEntryTable1650897900230 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const column = new TableColumn({ name: columnName, type: 'bigint', isNullable: true, isUnique: true });
    await transactionWrapper(queryRunner, async () => queryRunner.addColumn(tableName, column));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropColumn(tableName, columnName));
  }
}

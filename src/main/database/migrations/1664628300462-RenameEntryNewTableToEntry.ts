import { MigrationInterface, QueryRunner } from 'typeorm';
import { transactionWrapper } from '../utils';

const oldTableName = 'entry_new';
const newTableName = 'entry';

export class RenameEntryNewTableToEntry1664628300462 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.renameTable(oldTableName, newTableName));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.renameTable(newTableName, oldTableName));
  }
}

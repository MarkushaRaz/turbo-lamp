import { QueryRunner } from 'typeorm';

export async function transactionWrapper(
  queryRunner: QueryRunner,
  callback: (queryRunner: QueryRunner) => Promise<void>,
): Promise<void> {
  await queryRunner.commitTransaction();
  await queryRunner.query('PRAGMA foreign_keys = OFF');
  await queryRunner.startTransaction();
  await callback(queryRunner);
  await queryRunner.commitTransaction();
  await queryRunner.query('PRAGMA foreign_keys = ON');
  await queryRunner.startTransaction();
}

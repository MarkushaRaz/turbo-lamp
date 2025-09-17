import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

const tableName = 'log_message';
const isSentIndexName = 'IDX_IS_MESSAGE_SENT';
const dateIndexName = 'IDX_MESSAGE_DATE';

export class CreateLogMessageTable1712232043935 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: tableName,
      columns: [
        {
          name: 'id',
          type: 'varchar',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'uuid',
        },
        {
          name: 'text',
          type: 'text',
          isNullable: false,
        },
        {
          name: 'level',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'process',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'scope',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'date',
          type: 'datetime',
          isNullable: false,
        },
        {
          name: 'json_data',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'trace',
          type: 'text',
          isNullable: true,
        },
        {
          name: 'is_sent',
          type: 'boolean',
          isNullable: false,
          default: false,
        },
      ],
    });
    await queryRunner.createTable(table, true);
    await queryRunner.createIndices(tableName, [
      new TableIndex({
        name: isSentIndexName,
        columnNames: ['is_sent'],
      }),
      new TableIndex({
        name: dateIndexName,
        columnNames: ['date'],
      }),
    ]);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex(tableName, isSentIndexName);
    await queryRunner.dropIndex(tableName, dateIndexName);
    await queryRunner.dropTable(tableName);
  }
}

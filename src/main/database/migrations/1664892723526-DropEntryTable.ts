import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { EntryStatus, RecordingSource } from '_shared/enums';
import { transactionWrapper } from '../utils';

const tableName = 'entry';

export class DropEntryTable1664892723526 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await transactionWrapper(queryRunner, async () => queryRunner.dropTable(tableName));
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    const table = new Table({
      name: tableName,
      columns: [
        {
          name: 'id',
          type: 'integer',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'name',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'start_time',
          type: 'datetime',
          isNullable: false,
        },
        {
          name: 'end_time',
          type: 'datetime',
          isNullable: true,
        },
        {
          name: 'is_from_schedule',
          type: 'boolean',
          isNullable: false,
        },
        {
          name: 'schedule_id',
          type: 'integer',
          isNullable: true,
          isUnique: true,
        },
        {
          name: 'schedule_updated_at',
          type: 'datetime',
          isNullable: true,
          precision: 3,
        },
        {
          name: 'status',
          type: 'varchar',
          default: `'${EntryStatus.New}'`,
          isNullable: false,
        },
        {
          name: 'duration',
          type: 'integer',
          default: 0,
          isNullable: false,
        },
        {
          name: 'primary_kaltura_entry_id',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'size',
          type: 'integer',
          default: 0,
          isNullable: false,
        },
        {
          name: 'bytes_uploaded',
          type: 'integer',
          default: 0,
          isNullable: false,
        },
        {
          name: 'tags',
          type: 'text',
          default: "''",
          isNullable: false,
        },
        {
          name: 'description',
          type: 'text',
          default: "''",
          isNullable: false,
        },
        {
          name: 'teacher',
          type: 'varchar',
          default: "''",
          isNullable: false,
        },
        {
          name: 'email',
          type: 'varchar',
          default: "''",
          isNullable: false,
        },
        {
          name: 'subject',
          type: 'varchar',
          default: "''",
          isNullable: false,
        },
        {
          name: 'year',
          type: 'varchar',
          default: "''",
          isNullable: false,
        },
        {
          name: 'groups',
          type: 'text',
          default: "''",
          isNullable: false,
        },
        {
          name: 'faculties',
          type: 'text',
          default: "''",
          isNullable: false,
        },
        {
          name: 'type',
          type: 'varchar',
          default: "''",
          isNullable: false,
        },
        {
          name: 'primary_channel',
          type: 'varchar',
          default: `'${RecordingSource.Desktop}'`,
          isNullable: false,
        },
        {
          name: 'is_unlisted',
          type: 'boolean',
          default: false,
          isNullable: false,
        },
        {
          name: 'moodle_cmid',
          type: 'bigint',
          isNullable: true,
          isUnique: false,
        },
        {
          name: 'created_at',
          type: 'datetime',
          precision: 3,
          isNullable: false,
        },
        {
          name: 'updated_at',
          type: 'datetime',
          precision: 3,
          isNullable: false,
        },
      ],
    });

    await transactionWrapper(queryRunner, async () => queryRunner.createTable(table, true));
  }
}

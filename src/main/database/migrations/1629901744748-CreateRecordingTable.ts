import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import { RecordingStatus, UploadStatus } from '_shared/enums';

const tableName = 'recording';

export class CreateRecordingTable1629901744748 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
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
          name: 'kaltura_entry_id',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'token_id',
          type: 'varchar',
          isNullable: true,
        },
        {
          name: 'file_path',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'source',
          type: 'varchar',
          isNullable: false,
        },
        {
          name: 'bytes_uploaded',
          type: 'integer',
          default: 0,
          isNullable: false,
        },
        {
          name: 'upload_status',
          type: 'varchar',
          default: `'${UploadStatus.UnavailableForUpload}'`,
          isNullable: false,
        },
        {
          name: 'recording_status',
          type: 'varchar',
          default: `'${RecordingStatus.Pending}'`,
          isNullable: false,
        },
        {
          name: 'size',
          type: 'integer',
          default: 0,
          isNullable: false,
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
        {
          name: 'entry_id',
          type: 'integer',
          isNullable: true,
        },
      ],
      foreignKeys: [
        {
          columnNames: ['entry_id'],
          referencedTableName: 'entry',
          referencedColumnNames: ['id'],
          onDelete: 'cascade',
        },
      ],
    });

    await queryRunner.createTable(table, true);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable(tableName);
  }
}

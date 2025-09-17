import { MigrationInterface, QueryRunner } from 'typeorm';

const targetTable = 'entry_new';
const sourceTable = 'entry';

const copyDataSql = `
  INSERT INTO ${targetTable} (id, name, start_time, end_time, is_from_schedule, status, duration,
                              primary_kaltura_entry_id, size, bytes_uploaded, tags, description, teacher, email,
                              subject, year, groups, faculties, type, primary_channel, is_unlisted,
                              created_at, updated_at, schedule_id, schedule_updated_at, moodle_cmid)
  SELECT id,
         name,
         start_time,
         end_time,
         is_from_schedule,
         status,
         duration,
         primary_kaltura_entry_id,
         size,
         bytes_uploaded,
         tags,
         description,
         teacher,
         email,
         subject,
         year,
         groups,
         faculties,
         type,
         primary_channel,
         is_unlisted,
         created_at,
         updated_at,
         schedule_id,
         schedule_updated_at,
         moodle_cmid
  FROM ${sourceTable};
`;

export class CopyDataFromEntryToEntryNewTable1664628067102 implements MigrationInterface {
  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(copyDataSql);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable(targetTable);
  }
}

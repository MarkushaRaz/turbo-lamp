/* eslint import/no-cycle:off */

import _ from 'lodash';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { EntryStatus, RecordingSource } from '_shared/enums';
import { EntryData, RecordingData } from '_shared/types';
import { Recording } from './Recording';

@Entity()
export class Entry implements EntryData {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name: string;

  @Column()
  startTime: Date;

  @Column({ nullable: true })
  endTime!: Date | null;

  @Column()
  isFromSchedule: boolean;

  @Column({ nullable: true })
  scheduleId: number | null;

  @Column({ type: 'varchar', default: EntryStatus.New })
  status!: EntryStatus;

  @Column({ default: 0 })
  duration!: number;

  @Column({ nullable: true })
  primaryKalturaEntryId!: string | null;

  @Column({ default: 0 })
  size!: number;

  @Column({ default: 0 })
  bytesUploaded!: number;

  @Column({ type: 'text', default: '' })
  tags!: string;

  @Column({ type: 'text', default: '' })
  description!: string;

  @Column({ default: '' })
  teacher!: string;

  @Column({ default: '' })
  email!: string;

  @Column({ default: '' })
  subject!: string;

  @Column({ default: '' })
  year!: string;

  @Column({ type: 'text', default: '' })
  groups!: string;

  @Column({ type: 'text', default: '' })
  faculties!: string;

  @Column({ default: '' })
  type!: string;

  @Column({ nullable: true })
  moodleCmid: number | null;

  @Column({ nullable: true })
  sakaiIdcs: string | null;

  @Column({ type: 'varchar', default: RecordingSource.Camera })
  primaryChannel!: RecordingSource;

  @Column({ default: false })
  isUnlisted!: boolean;

  @Column({ precision: 3 })
  createdAt!: Date;

  @Column({ precision: 3 })
  updatedAt!: Date;

  @Column({ precision: 3, nullable: true })
  scheduleUpdatedAt!: Date | null;

  @OneToMany(() => Recording, (recording) => recording.entry, { eager: true })
  recordings: Recording[];

  @Column({ default: false })
  isUpdated: boolean;

  constructor(
    name: string,
    recordings: Recording[],
    isFromSchedule = false,
    scheduleId: number | null = null,
    startTime: Date = new Date(),
    endTime: Date | null = null,
    moodleCmid: number | null = null,
    sakaiIdcs: string | null = null,
  ) {
    this.name = name;
    this.recordings = recordings;
    this.isFromSchedule = isFromSchedule;
    this.scheduleId = scheduleId;
    this.startTime = startTime;
    this.endTime = endTime;
    this.moodleCmid = moodleCmid;
    this.sakaiIdcs = sakaiIdcs;
    this.isUpdated = !isFromSchedule;
  }

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

  @BeforeUpdate()
  setIsUpdated() {
    this.isUpdated = !this.isFromSchedule;
  }

  public toEntryData(): EntryData {
    const entryData: Partial<EntryData> = {};
    _.assign(entryData, _.omit(this, ['recordings']));
    entryData.recordings = [];

    for (let i = 0; i < this.recordings.length; i += 1) {
      const recordingData: Partial<RecordingData> = {};
      _.assign(recordingData, this.recordings[i]);
      entryData.recordings.push(recordingData as RecordingData);
    }

    return entryData as EntryData;
  }
}

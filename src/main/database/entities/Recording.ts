/* eslint import/no-cycle:off */

import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { RecordingSource, RecordingStatus, UploadStatus } from '_shared/enums';
import { RecordingData } from '_shared/types';
import { Entry } from './Entry';

@Entity()
export class Recording implements RecordingData {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Entry, (entry) => entry.recordings, { onDelete: 'CASCADE' })
  entry!: Entry;

  @Column({ nullable: true })
  kalturaEntryId!: string | null;

  @Column({ nullable: true })
  tokenId!: string | null;

  @Column()
  filePath: string;

  @Column({ type: 'varchar' })
  source: RecordingSource;

  @Column({ default: 0 })
  bytesUploaded!: number;

  @Column({ type: 'varchar', name: 'upload_status', default: UploadStatus.UnavailableForUpload })
  uploadStatus!: UploadStatus;

  @Column({ type: 'varchar', name: 'recording_status', default: RecordingStatus.Pending })
  recordingStatus!: RecordingStatus;

  @Column({ default: 0 })
  size!: number;

  @Column({ precision: 3 })
  createdAt!: Date;

  @Column({ precision: 3 })
  updatedAt!: Date;

  constructor(source: RecordingSource, recordingPath: string) {
    this.source = source;
    this.filePath = recordingPath;
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
}

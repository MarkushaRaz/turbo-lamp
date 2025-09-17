import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'log_message' })
export class DbLogMessage {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  text: string;

  @Column({ name: 'json_data', nullable: true })
  jsonData: string;

  @Index()
  @Column({ precision: 3 })
  date: Date;

  @Column()
  level: string;

  @Column()
  process: string;

  @Column()
  scope: string;

  @Column({ nullable: true })
  trace: string | undefined;

  @Index()
  @Column({ name: 'is_sent', default: false })
  isSent!: boolean;

  constructor(
    text: string,
    level: string,
    date: Date,
    process: string,
    scope: string,
    trace: string,
    jsonData: string,
  ) {
    this.date = date;
    this.level = level;
    this.text = text;
    this.process = process;
    this.scope = scope;
    this.trace = trace;
    this.jsonData = jsonData;
  }
}

export interface DbLogMessageParams {
  date: Date;
  json: string;
  level: string;
  process: string;
  scope?: string;
  text: string;
  trace: string;
}

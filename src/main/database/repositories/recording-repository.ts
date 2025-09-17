import { getDataSource } from '_main/database';
import { Recording } from '_main/database/entities/Recording';
import { getUniqueRecordingPath } from '_main/utils';
import { RecordingSource } from '_shared/enums';

export const recordingRepository = getDataSource()
  .getRepository(Recording)
  .extend({
    createRecording(source: RecordingSource): Recording {
      return new Recording(source, getUniqueRecordingPath());
    },
  });

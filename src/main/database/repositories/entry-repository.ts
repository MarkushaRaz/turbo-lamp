import _ from 'lodash';
import { getDataSource } from '_main/database';
import { Entry } from '_main/database/entities/Entry';
import { EntryData } from '_shared/types';
import { recordingRepository } from './recording-repository';

export const entryRepository = getDataSource()
  .getRepository(Entry)
  .extend({
    async updateEntryFromEntryData(entryData: EntryData) {
      const entry = await this.findOneBy({ id: entryData.id });
      if (!entry) throw new Error(`Entry #${entryData.id} not found!`);

      _.assign(entry, _.omit(entryData, ['recordings']));
      entry.recordings = [];

      for (let i = 0; i < entryData.recordings.length; i += 1) {
        let recording = await recordingRepository.findOneBy({ id: entryData.recordings[i].id });
        if (!recording) recording = recordingRepository.createRecording(entryData.recordings[i].source);
        _.assign(recording, _.omit(entryData.recordings[i], ['id', 'filePath']));
        entry.recordings.push(recording);
        await recordingRepository.save(recording);
      }

      await entryRepository.save(entry);
    },
  });

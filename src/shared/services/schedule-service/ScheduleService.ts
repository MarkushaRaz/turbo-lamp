import axios from 'axios';
import moment from 'moment';
import qs from 'qs';
import { EntryStatus, ProcessEnvKey } from '_shared/enums';
import { removeTrailingSlashes } from '_shared/utils';
import log from 'electron-log';
import { Lecture, LectureStatus, Room, ScheduleResource, Teacher } from './types';
import scheduleApiClient from './schedule-api-client';

const logger = log.scope('ScheduleService');

export class ScheduleService {
  private static client = scheduleApiClient;

  private static get serviceUrl(): string {
    const url = process.env[ProcessEnvKey.SCHEDULE_URL] ?? '';
    return removeTrailingSlashes(url);
  }

  private static get roomNumber(): string {
    return process.env[ProcessEnvKey.SCHEDULE_ROOM_NUMBER] ?? '';
  }

  private static buildResourceQueryUrl(
    resourceName: ScheduleResource,
    queryObj: unknown,
    scheduleUrlOverride?: string,
  ): string {
    const url = scheduleUrlOverride ? removeTrailingSlashes(scheduleUrlOverride) : ScheduleService.serviceUrl;
    const query = qs.stringify(queryObj);
    return `${url}/${resourceName}?${query}`;
  }

  private static buildResourceIdUrl(resourceName: ScheduleResource, resourceId: number) {
    return `${ScheduleService.serviceUrl}/${resourceName}/${resourceId}`;
  }

  public static async checkScheduleServiceAvailability() {
    logger.info(`Check schedule availability`);
    return ScheduleService.checkScheduleServiceExistsAtUrl(ScheduleService.serviceUrl);
  }

  public static async checkScheduleServiceExistsAtUrl(scheduleUrl: string): Promise<boolean> {
    const url = ScheduleService.buildResourceQueryUrl(ScheduleResource.Room, {}, scheduleUrl);

    try {
      const res = await ScheduleService.client.get<Array<Room>>(url);
      return res.data && Array.isArray(res.data);
    } catch (e) {
      return false;
    }
  }

  public static async checkRoomExistsInSchedule(scheduleUrl: string, roomNumber: string): Promise<boolean> {
    logger.info(`Check room in schedule`);
    const url = ScheduleService.buildResourceQueryUrl(
      ScheduleResource.Room,
      {
        _where: [{ number: roomNumber }, { 'room_type.control_service': false }],
      },
      scheduleUrl,
    );

    try {
      const res = await ScheduleService.client.get(url);
      return res.data && Array.isArray(res.data) && res.data.length;
    } catch (e) {
      return false;
    }
  }

  public static async checkLectureExistsInSchedule(lectureId: number): Promise<boolean> {
    logger.info(`Check lesson in schedule`);
    try {
      await ScheduleService.getLecture(lectureId);
      return true;
    } catch (e) {
      if (axios.isAxiosError(e) && e.response?.status === 404) {
        return false;
      }
      throw e;
    }
  }

  public static getCurrentLectures(): Promise<Lecture[]> {
    logger.info(`Get current lesson from schedule`);
    const url = ScheduleService.buildResourceQueryUrl(ScheduleResource.Lecture, {
      _where: [
        { 'room.number': ScheduleService.roomNumber },
        {
          _or: [
            { start_time_gte: moment().toDate(), start_time_lte: moment().add(15, 'minutes').toDate() },
            { start_time_lte: moment().toDate(), end_time_gte: moment().subtract(5, 'minutes').toDate() },
          ],
        },
      ],
      _sort: 'start_time:ASC',
    });
    return ScheduleService.client.get<Array<Lecture>>(url).then((res) => res.data);
  }

  public static getTeachers(): Promise<Teacher[]> {
    logger.info(`Get teachers from schedule`);
    const url = `${ScheduleService.serviceUrl}/${ScheduleResource.Teacher}`;
    return ScheduleService.client.get<Array<Teacher>>(url).then((res) => res.data);
  }

  public static getNewLectures(): Promise<Lecture[]> {
    logger.info(`Get new lessons from schedule`);
    const url = ScheduleService.buildResourceQueryUrl(ScheduleResource.Lecture, {
      _where: [{ status: LectureStatus.New }, { 'room.number': ScheduleService.roomNumber }],
    });

    return ScheduleService.client.get<Array<Lecture>>(url).then((res) => res.data);
  }

  public static getStuckLectures(): Promise<Lecture[]> {
    logger.info(`Get stuck lessons from schedule`);
    const url = ScheduleService.buildResourceQueryUrl(ScheduleResource.Lecture, {
      _where: [
        { status: [LectureStatus.Starting, LectureStatus.Live] },
        { 'room.number': ScheduleService.roomNumber },
        { end_time_lt: moment().subtract(5, 'minutes').toDate() },
      ],
    });

    return ScheduleService.client.get<Array<Lecture>>(url).then((res) => res.data);
  }

  public static getLecture(id: number): Promise<Lecture> {
    logger.info(`Get ${id} lesson from schedule`);
    const url = ScheduleService.buildResourceIdUrl(ScheduleResource.Lecture, id);
    return ScheduleService.client.get<Lecture>(url).then((res) => res.data);
  }

  public static updateLecture(id: number, lectureData: Partial<Lecture>): Promise<Lecture> {
    logger.info(`Update ${id} lesson in schedule`);
    const url = ScheduleService.buildResourceIdUrl(ScheduleResource.Lecture, id);
    return ScheduleService.client.put<Lecture>(url, lectureData).then((res) => res.data);
  }

  public static setLectureStatus(id: number, status: LectureStatus): Promise<Lecture> {
    logger.info(`Update ${id} lesson status with ${status} in schedule`);
    return ScheduleService.updateLecture(id, { status });
  }

  public static setLectureStatusByEntryStatus(id: number, status: EntryStatus) {
    let lectureStatus: LectureStatus | undefined;

    switch (status) {
      case EntryStatus.Failed:
        lectureStatus = LectureStatus.Failed;
        break;
      case EntryStatus.Missed:
        lectureStatus = LectureStatus.Missed;
        break;
      case EntryStatus.New:
        lectureStatus = LectureStatus.New;
        break;
      case EntryStatus.Pending:
        lectureStatus = LectureStatus.Starting;
        break;
      case EntryStatus.ReadyToUpload:
      case EntryStatus.Recorded:
        lectureStatus = LectureStatus.Recorded;
        break;
      case EntryStatus.Recording:
        lectureStatus = LectureStatus.Live;
        break;
      case EntryStatus.Uploaded:
        lectureStatus = LectureStatus.Ready;
        break;
      case EntryStatus.Uploading:
        lectureStatus = LectureStatus.Created;
        break;
      default:
        break;
    }

    if (lectureStatus) {
      return ScheduleService.setLectureStatus(id, lectureStatus);
    }

    return ScheduleService.getLecture(id);
  }

  public static setLectureKalturaEntryId(id: number, kalturaEntryId: string): Promise<Lecture> {
    logger.debug(`Set media entry id ${kalturaEntryId} to ${id} lesson in schedule`);
    return ScheduleService.updateLecture(id, { kaltura_id: kalturaEntryId });
  }

  public static setLectureStartTime(id: number, startTime: Date): Promise<Lecture> {
    logger.debug(`Set start time ${startTime} to ${id} lesson in schedule`);
    return ScheduleService.updateLecture(id, { start_time: startTime });
  }

  public static setLectureEndTime(id: number, endTime: Date): Promise<Lecture> {
    logger.debug(`Set end time ${endTime} to ${id} lesson in schedule`);
    return ScheduleService.updateLecture(id, { end_time: endTime });
  }

  public static getCurrentRoom(): Promise<Room | null> {
    logger.debug(`Get current room from schedule`);
    const url = ScheduleService.buildResourceQueryUrl(ScheduleResource.Room, {
      _where: [{ number: ScheduleService.roomNumber }],
    });

    return ScheduleService.client.get<Array<Room>>(url).then((res) => (res.data.length ? res.data[0] : null));
  }

  public static async updateCurrentRoom(roomData: Partial<Room>): Promise<Room> {
    logger.info('Update current room in schedule.', JSON.stringify(roomData));
    const currentRoom = await ScheduleService.getCurrentRoom();
    if (!currentRoom) throw new Error(`Room '${ScheduleService.roomNumber}' doesn't exists in the Schedule Service!`);

    const url = ScheduleService.buildResourceIdUrl(ScheduleResource.Room, currentRoom.id);
    const res = await ScheduleService.client.put<Room>(url, roomData);

    return res.data;
  }

  public static updateCurrentRoomLastOnline(): Promise<Room> {
    return ScheduleService.updateCurrentRoom({ last_online: new Date() });
  }
}

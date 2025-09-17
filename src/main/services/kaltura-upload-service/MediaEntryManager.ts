import log from 'electron-log';
import { FileHandle, open } from 'fs/promises';
import kaltura from 'kaltura-client';
import {
  KalturaMediaEntry,
  KalturaUploadedFileTokenResource,
  KalturaUploadToken,
  KalturaUploadTokenStatus,
} from 'kaltura-typescript-client/api/types';
import { DEFAULT_KALTURA_USER_ID } from '_main/constants';
import { Entry, Recording } from '_main/database/entities';
import { entryRepository, recordingRepository } from '_main/database/repositories';
import { EMPTY_STRING } from '_shared/constants';
import { asError } from '_shared/utils';
import { KalturaClientManager } from './KalturaClientManager';
import { makeEntryCategories } from './make-entry-categories';
import { TokenState, TokenInfo } from './types';

const logger = log.scope('MediaEntryManager');

const maxChunkSize = 1024 * 2 * 1000;
const noConnection = 'ECONNREFUSED';

export class MediaEntryManager {
  private readonly recording: Recording;

  private readonly size: number;

  private fileHandle!: FileHandle;

  constructor(recording: Recording) {
    this.recording = recording;
    this.size = this.recording.size;
  }

  private async ensureUploadTokenIsValid(): Promise<KalturaUploadToken> {
    const { tokenId } = this.recording;
    if (!tokenId) throw new Error('missing upload token');

    const { isValid, token } = await MediaEntryManager.isUploadTokenValid(tokenId);
    if (!isValid || !token) {
      this.recording.tokenId = null;
      throw new Error('invalid upload token');
    }
    logger.debug('Token and entry are valid. Token id:', tokenId, 'Recording id:', this.recording.id);
    return token;
  }

  private static isDateAWeekAgo = (date: Date): boolean => Number(date) < Date.now() / 1000 - 604800;

  private static handleNotFoundOrNoConnectionErrors(e: object): false {
    if ('code' in e && e.code === noConnection) throw new Error('Connection problem');
    return false;
  }

  private async uploadNextChunk(): Promise<number> {
    const token = await this.ensureUploadTokenIsValid();
    const bytesUploaded = Number(token.uploadedFileSize);
    const chunkSize = MediaEntryManager.getBufferSize(bytesUploaded, this.size);
    const buffer = Buffer.alloc(chunkSize);
    const endBytePosition = bytesUploaded + chunkSize;

    await this.fileHandle.read(buffer, 0, chunkSize, bytesUploaded);
    await kaltura.services.uploadToken
      .upload(token.id, buffer, true, endBytePosition === this.size, bytesUploaded)
      .execute(KalturaClientManager.client);
    return endBytePosition;
  }

  public async startFileUploading(entry: Entry) {
    try {
      this.fileHandle = await open(this.recording.filePath);
      do {
        this.recording.bytesUploaded = await this.uploadNextChunk();
        await recordingRepository.save(this.recording);
        await MediaEntryManager.saveEntryProgress(entry);
      } while (this.recording.bytesUploaded !== this.size);
    } finally {
      try {
        await this.fileHandle.close();
      } catch (error) {
        logger.warn(`Unable to close file ${this.recording.filePath}: ${asError(error).message}`);
      }
    }
  }

  private static saveEntryProgress(entry: Entry) {
    entry.bytesUploaded = entry.recordings.reduce((total, r) => total + r.bytesUploaded, 0);
    return entryRepository.save(entry);
  }

  private static getBufferSize(uploaded: number, size: number): number {
    if (size - uploaded < maxChunkSize) return size - uploaded;
    return maxChunkSize;
  }

  private static getUploadToken(tokenId: string): Promise<KalturaUploadToken> {
    return kaltura.services.uploadToken.get(tokenId).execute<KalturaUploadToken>(KalturaClientManager.client);
  }

  public static checkMediaEntryExists(id: string): Promise<boolean> {
    return MediaEntryManager.getMediaEntry(id)
      .then(() => true)
      .catch(MediaEntryManager.handleNotFoundOrNoConnectionErrors);
  }

  public static getMediaEntry(id: string): Promise<KalturaMediaEntry> {
    return kaltura.services.media.get(id, -1).execute<KalturaMediaEntry>(KalturaClientManager.client);
  }

  public static createMediaEntry(entry: Entry, child: boolean): Promise<KalturaMediaEntry> {
    let { tags } = entry;
    if (child) tags = `${tags}, child`;
    const mediaEntry = new kaltura.objects.MediaEntry();
    mediaEntry.name = entry.name;
    mediaEntry.tags = tags || EMPTY_STRING;
    mediaEntry.categories = makeEntryCategories(entry);
    mediaEntry.description = entry.description || EMPTY_STRING;
    mediaEntry.mediaType = kaltura.enums.MediaType.VIDEO;
    mediaEntry.userId = entry.email || DEFAULT_KALTURA_USER_ID;
    return kaltura.services.media.add(mediaEntry).execute<KalturaMediaEntry>(KalturaClientManager.client);
  }

  public static async createAndActivateUploadToken(name: string): Promise<KalturaUploadToken> {
    const uploadToken = new kaltura.objects.UploadToken();
    uploadToken.fileName = name;
    const token = await kaltura.services.uploadToken
      .add(uploadToken)
      .execute<KalturaUploadToken>(KalturaClientManager.client);
    return kaltura.services.uploadToken
      .upload(token.id, Buffer.alloc(0), false, false, 0)
      .execute<KalturaUploadToken>(KalturaClientManager.client);
  }

  public static addContentToMediaEntry(entryId: string, tokenId: string): Promise<KalturaUploadedFileTokenResource> {
    const resource = new kaltura.objects.UploadedFileTokenResource();
    resource.token = tokenId;
    return kaltura.services.media
      .addContent(entryId, resource)
      .execute<KalturaUploadedFileTokenResource>(KalturaClientManager.client);
  }

  public static checkTokenExists(tokenId: string): Promise<TokenState> {
    return MediaEntryManager.getUploadToken(tokenId).catch(MediaEntryManager.handleNotFoundOrNoConnectionErrors);
  }

  public static async isUploadTokenValid(tokenId: string | null): Promise<TokenInfo> {
    if (!tokenId) return { isValid: false };
    const token = await MediaEntryManager.checkTokenExists(tokenId);

    if (token === false) return { isValid: token };

    const { status, updatedAt } = token;
    const { pending, partialUpload } = KalturaUploadTokenStatus;

    if (status === partialUpload && this.isDateAWeekAgo(updatedAt)) return { isValid: false };

    return { isValid: [pending, partialUpload].includes(status), token };
  }

  public static setParentId(childMediaEntryId: string, primaryMediaEntryId: string): Promise<unknown> {
    const mediaEntry = new kaltura.objects.MediaEntry();
    mediaEntry.parentEntryId = primaryMediaEntryId;
    return kaltura.services.media.update(childMediaEntryId, mediaEntry).execute(KalturaClientManager.client);
  }
}

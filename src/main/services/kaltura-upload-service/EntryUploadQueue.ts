export class EntryUploadQueue {
  private static readonly queue = new Set<number>();

  public static add = (id: number) => this.queue.add(id);

  public static remove = (id: number) => this.queue.delete(id);

  public static has = (id: number) => this.queue.has(id);
}

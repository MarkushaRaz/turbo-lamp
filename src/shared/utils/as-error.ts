export function asError(e: unknown): Error {
  if (e === null) return new Error('Null');
  if (e === undefined) return new Error('Undefined');
  if (e instanceof Error) return e;
  if (typeof e === 'string') return new Error(e);
  if (typeof e === 'symbol') return new Error(e.toString());
  if (typeof e === 'object') {
    try {
      return new Error(JSON.stringify(e));
    } catch (error) {
      return new Error('Object');
    }
  }
  if (typeof e === 'number' || typeof e === 'boolean') return new Error(e?.toString());
  if (typeof e === 'function') return new Error(e.toString());
  return new Error('Unknown');
}

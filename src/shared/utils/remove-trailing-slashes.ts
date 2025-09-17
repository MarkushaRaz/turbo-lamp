export function removeTrailingSlashes(str: string) {
  return str.replace(/\/+$/, '');
}

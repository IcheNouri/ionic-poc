export function convertBytesToReadableString(bytes: number, decimalPlace = 2, si = true): string {
  // See https://stackoverflow.com/questions/10420352/converting-file-size-in-bytes-to-human-readable-string
  const thresh = si ? 1000 : 1024;

  if (Math.abs(bytes) < thresh) {
    return bytes.toFixed(decimalPlace).toString() + ' B';
  }

  const units = si ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'] : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
  let u = -1;
  const r = 10 ** decimalPlace;

  do {
    bytes /= thresh;
    ++u;
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1);

  return bytes.toFixed(decimalPlace).toString() + ' ' + units[u];
}

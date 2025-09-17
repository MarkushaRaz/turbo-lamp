import net from 'net';

export function isIPv4(input: string): boolean {
  return net.isIPv4(input);
}

export function isIPv4WithOptionalPort(input: string): boolean {
  const parts = input.split(':');
  const [ipPart, portPart] = parts;

  if (parts.length > 2) return false;

  if (!isIPv4(ipPart)) return false;

  if (parts.length === 2 && !portPart) return false;

  if (portPart) {
    const port = Number(portPart);
    if (Number.isNaN(port) || !Number.isInteger(port) || port < 1 || port > 65535) {
      return false;
    }
  }

  return true;
}

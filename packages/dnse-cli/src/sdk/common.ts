import { createHmac } from 'node:crypto';

export const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
export const MONTH_NAMES = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
] as const;

export type Algorithm = 'hmac-sha256' | 'hmac-sha384' | 'hmac-sha512';
type Digest = 'sha256' | 'sha384' | 'sha512' | 'sha1';

function pad2(value: number): string {
  return String(value).padStart(2, '0');
}

export function formatDateHeader(date: Date): string {
  const dayName = DAY_NAMES[date.getUTCDay()];
  const day = pad2(date.getUTCDate());
  const month = MONTH_NAMES[date.getUTCMonth()];
  const year = date.getUTCFullYear();
  const hours = pad2(date.getUTCHours());
  const minutes = pad2(date.getUTCMinutes());
  const seconds = pad2(date.getUTCSeconds());
  return `${dayName}, ${day} ${month} ${year} ${hours}:${minutes}:${seconds} +0000`;
}

function resolveDigest(algorithm: Algorithm): Digest {
  switch (algorithm) {
    case 'hmac-sha256':
      return 'sha256';
    case 'hmac-sha384':
      return 'sha384';
    case 'hmac-sha512':
      return 'sha512';
    default:
      return 'sha1';
  }
}

export interface SignatureResult {
  headers: string;
  signature: string;
}

export function buildSignature(
  secret: string,
  method: string,
  path: string,
  dateValue: string,
  algorithm: Algorithm,
  nonce: string | null,
): SignatureResult {
  const headers = '(request-target) date';
  let signatureString = `(request-target): ${method.toLowerCase()} ${path}\n`;
  signatureString += `date: ${dateValue}`;
  if (nonce) {
    signatureString += `\nnonce: ${nonce}`;
  }

  const digest = resolveDigest(algorithm);
  const hmac = createHmac(digest, Buffer.from(secret, 'utf8'));
  hmac.update(signatureString, 'utf8');
  const encoded = hmac.digest('base64');
  const escaped = encodeURIComponent(encoded);

  return { headers, signature: escaped };
}

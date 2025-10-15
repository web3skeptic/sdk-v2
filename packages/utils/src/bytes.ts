// Pre-computed lookup table for byte-to-hex conversion
const byteToHex: string[] = [];
for (let i = 0; i < 256; i++) {
  byteToHex[i] = i.toString(16).padStart(2, '0');
}

/**
 * Convert a Uint8Array to a hex string with 0x prefix
 */
export function bytesToHex(bytes: Uint8Array): string {
  let hex = '0x';
  for (let i = 0; i < bytes.length; i++) {
    hex += byteToHex[bytes[i]];
  }
  return hex;
}

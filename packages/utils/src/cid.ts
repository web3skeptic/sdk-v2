import { CID } from 'multiformats/cid';
import { base58btc } from 'multiformats/bases/base58';
import type { Hex } from '@circles-sdk/types';

/**
 * Convert a CIDv0 string to a bytes32 hex string for on-chain storage
 *
 * CIDv0 format:
 * - Base58 encoded multihash
 * - Always uses SHA-256 hash algorithm
 * - Contains 32-byte hash digest
 *
 * This function is browser-compatible using the modern `multiformats` library.
 *
 * @param cidV0 - The CIDv0 string (e.g., "QmXxxx...")
 * @returns The 32-byte hash digest as a hex string
 * @throws Error if the CID is invalid or uses unsupported hash algorithm
 *
 * @example
 * ```typescript
 * const hex = cidV0ToHex('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
 * // Returns: '0x...' (32 bytes / 64 hex characters)
 * ```
 */
export function cidV0ToHex(cidV0: string): Hex {
  // Parse the CIDv0 string using base58btc decoder
  const cid = CID.parse(cidV0, base58btc);

  // Verify this is CIDv0
  if (cid.version !== 0) {
    throw new Error(`Expected CIDv0, got CIDv${cid.version}`);
  }

  // Verify the multihash uses SHA-256 (code: 0x12)
  if (cid.multihash.code !== 0x12) {
    throw new Error('Unsupported hash algorithm. Only SHA-256 is supported for CIDv0.');
  }

  // Extract the 32-byte hash digest and convert to hex
  const digest = cid.multihash.digest;
  const hexString = `0x${Array.from(digest).map(b => b.toString(16).padStart(2, '0')).join('')}` as Hex;

  return hexString;
}

/**
 * Convert a CIDv0 string to a Uint8Array of the hash digest
 *
 * This function is browser-compatible using the modern `multiformats` library.
 *
 * @param cidV0 - The CIDv0 string (e.g., "QmXxxx...")
 * @returns The 32-byte hash digest as a Uint8Array
 * @throws Error if the CID is invalid or uses unsupported hash algorithm
 *
 * @example
 * ```typescript
 * const bytes = cidV0ToUint8Array('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
 * // Returns: Uint8Array(32) [...]
 * ```
 */
export function cidV0ToUint8Array(cidV0: string): Uint8Array {
  // Parse the CIDv0 string using base58btc decoder
  const cid = CID.parse(cidV0, base58btc);

  // Verify this is CIDv0
  if (cid.version !== 0) {
    throw new Error(`Expected CIDv0, got CIDv${cid.version}`);
  }

  // Verify the multihash uses SHA-256 (code: 0x12)
  if (cid.multihash.code !== 0x12) {
    throw new Error('Unsupported hash algorithm. Only SHA-256 is supported for CIDv0.');
  }

  // Extract and return the 32-byte hash digest
  return cid.multihash.digest;
}

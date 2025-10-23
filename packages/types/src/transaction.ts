import type { Address } from './base';

/**
 * Transaction history types
 */

/**
 * Transaction history row (base data from RPC)
 */
export interface TransactionHistoryRow {
  blockNumber: number;
  timestamp: number;
  transactionIndex: number;
  logIndex: number;
  transactionHash: string;
  version: number;
  from: Address;
  to: Address;
  id: string;
  tokenAddress: Address;
  value: string;
}

/**
 * Transaction history row with calculated circle amounts
 * Includes conversions between different circle representations
 */
export interface TransactionHistoryRowWithCircles extends TransactionHistoryRow {
  /** Human-readable circle amount (demurraged) */
  circles: number;
  /** Atto-circles (demurraged, 18 decimals) */
  attoCircles: bigint;
  /** Static circles (inflationary, human-readable) */
  staticCircles: number;
  /** Atto-static circles (inflationary, 18 decimals) */
  staticAttoCircles: bigint;
  /** Time Circles (CRC) human-readable */
  crc: number;
  /** Atto-CRC (18 decimals) */
  attoCrc: bigint;
}

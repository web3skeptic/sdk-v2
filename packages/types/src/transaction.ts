import type { Address } from './base';

/**
 * Transaction history types
 */

/**
 * Transaction history row
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

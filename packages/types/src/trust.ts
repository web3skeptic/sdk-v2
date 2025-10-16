import type { Address, Hex } from './base';

/**
 * Trust relation types
 */

/**
 * Trust relation information
 */
export interface TrustRelation {
  blockNumber: number;
  timestamp: number;
  transactionIndex: number;
  logIndex: number;
  transactionHash: Hex;
  truster: Address;
  trustee: Address;
  expiryTime: number;
}

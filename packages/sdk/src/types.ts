import type {
  Address,
  AvatarInfo,
  TokenBalance
} from '@circles-sdk/types';
import type { ContractRunner } from '@circles-sdk/runner';
import type { AggregatedTrustRelation } from '@circles-sdk/rpc';

// Re-export types from rpc package (events are now part of rpc)
export type { Observable, CirclesEvent, CirclesEventType } from '@circles-sdk/rpc';

// Re-export types from types package
export type { TransactionHistoryRow } from '@circles-sdk/types';

/**
 * Avatar row data from RPC
 */
export interface AvatarRow {
  address: Address;
  version: number;
  type: string;
  cidV0?: string; // Profile CID stored in the name registry
  // Additional fields as needed
}

/**
 * Token balance row from RPC
 */
export interface TokenBalanceRow {
  tokenAddress: Address;
  balance: bigint;
  // Additional fields as needed
}

/**
 * Trust relation row from RPC
 */
export interface TrustRelationRow {
  truster: Address;
  trustee: Address;
  expiryTime: number;
}

/**
 * Circles query result with pagination
 */
export interface CirclesQuery<T> {
  rows: T[];
  hasMore: boolean;
  nextPage(): Promise<CirclesQuery<T>>;
}

// Re-export ContractRunner for convenience
export type { ContractRunner };

/**
 * Circles data access layer
 * Provides read access to Circles protocol data
 */
export interface CirclesData {
  getAvatar(address: Address): Promise<AvatarInfo | undefined>;
  getTrustRelations(address: Address): Promise<AggregatedTrustRelation[]>;
  getBalances(address: Address): Promise<TokenBalance[]>;
}

/**
 * HubV2 contract interface
 */
export interface HubV2 {
  // TODO: Define HubV2 methods
  registerHuman(inviter: Address): Promise<any>;
  registerOrganization(): Promise<any>;
  registerGroup(mint: Address, name: string, symbol: string): Promise<any>;
  trust(trustee: Address, expiry: bigint): Promise<any>;
  personalMint(): Promise<any>;
  groupMint(group: Address, collateral: Address[], amounts: bigint[], data: Uint8Array): Promise<any>;
}

/**
 * V2 Pathfinder service
 */
export interface V2Pathfinder {
  // TODO: Define pathfinder methods
  computeTransfer(from: Address, to: Address, value: bigint): Promise<any>;
  findPath(from: Address, to: Address, value: bigint): Promise<any>;
}

/**
 * Group type enumeration
 */
export enum GroupType {
  Standard = 'Standard',
  Custom = 'Custom',
}


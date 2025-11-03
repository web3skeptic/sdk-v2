import type {
  Address,
  AvatarInfo,
  TokenBalance
} from '@circles-sdk/types';
import type { AggregatedTrustRelation } from '@circles-sdk/rpc';

/**
 * Circles data access layer
 * Provides read access to Circles protocol data
 */
export interface CirclesData {
  getAvatar(address: Address): Promise<AvatarInfo | undefined>;
  getTrustRelations(address: Address): Promise<AggregatedTrustRelation[]>;
  getBalances(address: Address): Promise<TokenBalance[]>;
}


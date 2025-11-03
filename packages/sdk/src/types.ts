import type {
  Address,
  AvatarInfo,
  TokenBalance
} from '@circles-sdk-v2/types';
import type { AggregatedTrustRelation } from '@circles-sdk-v2/rpc';

/**
 * Circles data access layer
 * Provides read access to Circles protocol data
 */
export interface CirclesData {
  getAvatar(address: Address): Promise<AvatarInfo | undefined>;
  getTrustRelations(address: Address): Promise<AggregatedTrustRelation[]>;
  getBalances(address: Address): Promise<TokenBalance[]>;
}


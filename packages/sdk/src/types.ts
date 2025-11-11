import type {
  Address,
  AvatarInfo,
  TokenBalance,
  AggregatedTrustRelation
} from '@aboutcircles/sdk-types';


/**
 * Circles data access layer
 * Provides read access to Circles protocol data
 */
export interface CirclesData {
  getAvatar(address: Address): Promise<AvatarInfo | undefined>;
  getTrustRelations(address: Address): Promise<AggregatedTrustRelation[]>;
  getBalances(address: Address): Promise<TokenBalance[]>;
}


// Main SDK class
export { Sdk } from './Sdk';

// Avatar classes
export { HumanAvatar, OrganisationAvatar, BaseGroupAvatar } from './avatars';
export type { PathfindingOptions } from './avatars';
export type { TransactionReceipt } from 'viem';

// Error handling
export { SdkError } from './errors';
export type { SdkErrorSource } from './errors';

// Re-export trust relation types from RPC
export type { AggregatedTrustRelation, TrustRelationType } from '@circles-sdk/rpc';

// All types (consolidated in types.ts)
export type {
  // Avatar types
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  CirclesEvent,
  CirclesQuery,
  Observable,
  // SDK types
  ContractRunner,
  CirclesData,
  HubV2,
  V2Pathfinder,
  GroupType,
} from './types';

// Main RPC class
export { CirclesRpc } from './rpc';

// Client
export { RpcClient } from './client';

// Method classes
export {
  PathfinderMethods,
  QueryMethods,
  TrustMethods,
  BalanceMethods,
  AvatarMethods,
  ProfileMethods,
  TokenMethods,
  InvitationMethods,
  TransactionMethods,
  GroupMethods,
} from './methods';

// RPC-specific types
export type {
  TransactionHistoryRow,
  SearchResultProfile,
  GroupTokenHolderRow,
  CursorColumn,
  FlexiblePagedResult,
} from './types';

// Re-export shared types from @aboutcircles/sdk-types for convenience
export type { TrustRelationType, AggregatedTrustRelation } from '@aboutcircles/sdk-types';

// Error handling
export { RpcError } from './errors';
export type { RpcErrorSource } from './errors';

// Utils
export { normalizeAddress, normalizeAddresses, parseStringsToBigInt } from './utils';

// Pagination
export { PagedQuery } from './pagedQuery';

// Events (subscription and observation)
export {
  Observable,
  parseRpcEvent,
  parseRpcSubscriptionMessage,
  isCirclesEvent,
} from './events';

export type {
  CirclesEvent,
  CirclesEventType,
  CirclesBaseEvent,
  CirclesEventOfType,
  RpcSubscriptionEvent,
} from './events';

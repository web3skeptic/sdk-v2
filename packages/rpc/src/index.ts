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

// Types
export type { TrustRelationType, AggregatedTrustRelation, GroupTokenHolderRow } from './methods';
export type { TransactionHistoryRow } from '@circles-sdk-v2/types';

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

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
export type { TrustRelationType, AggregatedTrustRelation } from './methods';
export type { TransactionHistoryRowWithCircles } from '@circles-sdk/types';

// Error handling
export { RpcError } from './errors';
export type { RpcErrorSource } from './errors';

// Utils
export { normalizeAddress, normalizeAddresses, parseStringsToBigInt } from './utils';

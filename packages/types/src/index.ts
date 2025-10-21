/**
 * Circles SDK Types
 *
 * All types are organized by domain for better maintainability
 */

// Base EVM types
export type {
  Address,
  Hex,
  Hash,
  ContractConfig,
  TransactionRequest,
  TransactionResponse,
  CallResult,
} from './base';

// JSON-RPC types
export type { JsonRpcRequest, JsonRpcResponse } from './rpc';

// Query and filter types
export type {
  FilterType,
  ConjunctionType,
  FilterPredicate,
  Conjunction,
  Filter,
  SortOrder,
  OrderBy,
  QueryParams,
  TableInfo,
} from './query';

// Avatar and profile types
export type { AvatarInfo, Profile, GroupProfile } from './avatar';

// Token types
export type { TokenBalance, TokenInfo } from './token';

// Trust relation types
export type { TrustRelation } from './trust';

// Transaction types
export type { TransactionHistoryRow } from './transaction';

// Group types
export type { GroupRow, GroupMembershipRow, GroupQueryParams } from './group';

// Pathfinding types
export type {
  SimulatedBalance,
  FindPathParams,
  TransferStep,
  PathfindingResult,
  FlowEdgeStruct,
  StreamStruct,
  FlowMatrix,
  AdvancedTransferOptions,
} from './pathfinding';

// Network types
export type { EventType, NetworkSnapshot } from './network';

// Configuration types
export type { CirclesConfig } from './config';

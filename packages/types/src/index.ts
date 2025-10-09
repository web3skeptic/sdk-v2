import type { Abi } from 'abitype';
import type { Address as ViemAddress } from 'viem';

/**
 * Base types for EVM interaction
 */
export type Address = ViemAddress;
export type Hex = `0x${string}`;
export type Hash = `0x${string}`;

/**
 * Generic contract configuration
 */
export interface ContractConfig<TAbi extends Abi = Abi> {
  address: Address;
  abi: TAbi;
}

/**
 * Transaction request object
 * Contains all data needed to send a transaction
 */
export interface TransactionRequest {
  from?: Address;
  to: Address;
  data: Hex;
  value?: bigint;
  gas?: bigint;
  gasPrice?: bigint;
  nonce?: number;
}

/**
 * Transaction response
 */
export interface TransactionResponse {
  hash: Hash;
  from: Address;
  to?: Address;
  data: Hex;
  value: bigint;
  blockNumber?: number;
  blockHash?: Hash;
}

/**
 * Call result
 */
export interface CallResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
}

/**
 * JSON-RPC request structure
 */
export interface JsonRpcRequest<TParams = unknown[]> {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params: TParams;
}

/**
 * JSON-RPC response structure
 */
export interface JsonRpcResponse<TResult = unknown> {
  jsonrpc: '2.0';
  id: number | string;
  result?: TResult;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

/**
 * Filter types for circles_query
 */
export type FilterType = 'Equals' | 'NotEquals' | 'GreaterThan' | 'LessThan' | 'GreaterOrEqualThan' | 'LessOrEqualThan';
export type ConjunctionType = 'And' | 'Or';

export interface FilterPredicate {
  Type: 'FilterPredicate';
  FilterType: FilterType;
  Column: string;
  Value: string | number | boolean;
}

export interface Conjunction {
  Type: 'Conjunction';
  ConjunctionType: ConjunctionType;
  Predicates: (FilterPredicate | Conjunction)[];
}

export type Filter = FilterPredicate | Conjunction;

/**
 * Order direction for query results
 */
export type SortOrder = 'ASC' | 'DESC';

export interface OrderBy {
  Column: string;
  SortOrder: SortOrder;
}

/**
 * Query parameters for circles_query
 */
export interface QueryParams {
  Namespace: string;
  Table: string;
  Columns: string[];
  Filter: Filter[];
  Order: OrderBy[];
  Limit?: number;
}

/**
 * Simulated balance for path finding
 */
export interface SimulatedBalance {
  holder: Address;
  token: Address;
  amount: bigint;
  isWrapped: boolean;
}

/**
 * Path finding parameters for circlesV2_findPath
 */
export interface FindPathParams {
  from: Address;
  to: Address;
  targetFlow: bigint;
  useWrappedBalances?: boolean;
  fromTokens?: Address[];
  toTokens?: Address[];
  excludeFromTokens?: Address[];
  excludeToTokens?: Address[];
  simulatedBalances?: SimulatedBalance[];
}

/**
 * Path finding response
 */
export interface PathStep {
  from: Address;
  to: Address;
  token: Address;
  amount: bigint;
}

export interface PathResponse {
  flow: bigint;
  transfers: PathStep[];
}

/**
 * Token balance information
 */
export interface TokenBalance {
  tokenAddress: Address;
  tokenId: bigint;
  tokenOwner: Address;
  tokenType: string;
  version: number;
  attoCircles: bigint;
  circles: number;
  staticAttoCircles: bigint;
  staticCircles: number;
  attoCrc: bigint;
  crc: number;
  isErc20: boolean;
  isErc1155: boolean;
  isWrapped: boolean;
  isInflationary: boolean;
  isGroup: boolean;
}

/**
 * Avatar information
 * Contains basic information about a Circles avatar.
 */
export interface AvatarInfo {
  /**
   * The block number of the event
   */
  blockNumber: number;
  /**
   * The timestamp of the last change to the avatar
   */
  timestamp: number;
  /**
   * The transaction index
   */
  transactionIndex: number;
  /**
   * The log index
   */
  logIndex: number;
  /**
   * The hash of the transaction that last changed the avatar
   */
  transactionHash: string;
  /**
   * If the avatar is currently active in version 1 or 2
   * Note: An avatar that's active in v2 can still have a v1 token. See `hasV1` and `v1Token`.
   */
  version: number;
  /**
   * The type of the avatar
   */
  type: 'CrcV2_RegisterHuman' | 'CrcV2_RegisterGroup' | 'CrcV2_RegisterOrganization' | 'CrcV1_Signup' | 'CrcV1_OrganizationSignup';
  /**
   * The address of the avatar
   */
  avatar: Address;
  /**
   * The personal or group token address (v1) or tokenId (v2)
   * Note: v1 tokens are erc20 and have a token address. v2 tokens are erc1155 and have a tokenId.
   *       The v2 tokenId is always an encoded version of the avatar address.
   */
  tokenId?: string;
  /**
   * If the avatar is signed up at v1
   */
  hasV1: boolean;
  /**
   * If the avatar has a v1 token, this is the token address
   */
  v1Token?: Address;
  /**
   * The bytes of the avatar's metadata cidv0
   */
  cidV0Digest?: string;
  /**
   * The CIDv0 of the avatar's metadata (profile)
   */
  cidV0?: string;
  /**
   * If the avatar is stopped in v1
   * Note: This is only set during Avatar initialization.
   */
  v1Stopped?: boolean;
  /**
   * Indicates whether the entity is a human
   */
  isHuman: boolean;
  /**
   * Groups have a name
   */
  name?: string;
  /**
   * Groups have a symbol
   */
  symbol?: string;
}

/**
 * Token information
 */
export interface TokenInfo {
  blockNumber: number;
  timestamp: number;
  transactionIndex: number;
  logIndex: number;
  transactionHash: string;
  version: number;
  type: string;
  token: Address;
  tokenOwner: Address;
}

/**
 * Profile information
 */
export interface Profile {
  name?: string;
  description?: string;
  imageUrl?: string;
  previewImageUrl?: string;
  avatarCid?: string;
  [key: string]: unknown;
}

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

/**
 * Event types
 */
export type EventType =
  | 'CrcV1_Trust'
  | 'CrcV1_HubTransfer'
  | 'CrcV1_Signup'
  | 'CrcV1_OrganizationSignup'
  | 'CrcV2_RegisterHuman'
  | 'CrcV2_RegisterOrganization'
  | 'CrcV2_RegisterGroup'
  | 'CrcV2_Trust'
  | 'CrcV2_TransferSingle'
  | 'CrcV2_TransferBatch';

/**
 * Network snapshot structure
 */
export interface NetworkSnapshot {
  trustRelations: TrustRelation[];
  balances: TokenBalance[];
  blockNumber: number;
  timestamp: number;
}

/**
 * Table information
 */
export interface TableInfo {
  Namespace: string;
  Table: string;
  Columns: {
    Name: string;
    Type: string;
  }[];
}

/**
 * Pathfinding types
 */

/**
 * A single transfer step in a pathfinding result
 */
export interface TransferStep {
  from: string;
  to: string;
  tokenOwner: string;
  value: string;
}

/**
 * Result of pathfinding computation
 */
export interface PathfindingResult {
  maxFlow: string;
  transfers: TransferStep[];
}

/**
 * Flow matrix for ABI encoding
 * Uses FlowEdgeStruct and StreamStruct from @circles-sdk/abi-v2
 */
export interface FlowMatrix {
  flowVertices: string[]; // address[]
  flowEdges: any[]; // FlowEdgeStruct[] - tuple(uint16,uint192)[]
  streams: any[]; // StreamStruct[] - tuple(uint16,uint16[],bytes)[]
  packedCoordinates: string; // hex bytes
  sourceCoordinate: number; // convenience, not part of ABI
}

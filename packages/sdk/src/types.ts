import type {
  Address,
  CirclesConfig,
  Profile,
  GroupProfile,
  TransactionResponse,
  TransactionRequest
} from '@circles-sdk/types';
import type { ContractRunner } from '@circles-sdk/runner';

/**
 * Observable type for event streaming
 */
export type Observable<T> = {
  subscribe(observer: (value: T) => void): { unsubscribe(): void };
};

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
 * Transaction history row from RPC
 */
export interface TransactionHistoryRow {
  hash: string;
  from: Address;
  to: Address;
  value: bigint;
  timestamp: number;
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
 * Circles event type
 */
export interface CirclesEvent {
  type: string;
  data: any;
}

/**
 * Circles query result with pagination
 */
export interface CirclesQuery<T> {
  rows: T[];
  hasMore: boolean;
  nextPage(): Promise<CirclesQuery<T>>;
}

/**
 * Avatar interface representing a Circles identity
 * Provides a simplified, user-friendly API for interacting with Circles
 */
export interface AvatarInterface {
  // Basic properties
  readonly address: Address;
  readonly avatarInfo: AvatarRow | undefined;
  readonly events: Observable<CirclesEvent>;

  // Balance methods
  balances: {
    getTotal(): Promise<number>;
    getDetailed(): Promise<TokenBalanceRow[]>;
    getGasToken(): Promise<bigint>;
    getTotalSupply(): Promise<bigint>;
  };

  // Transfer methods
  transfer: {
    send(to: Address, amount: number | bigint): Promise<TransactionResponse>;
    advanced(
      to: Address,
      amount: number | bigint,
      options?: {
        token?: Address;
        txData?: Uint8Array;
        useWrappedBalances?: boolean;
        fromTokens?: Address[];
        toTokens?: Address[];
        excludeFromTokens?: Address[];
        excludeToTokens?: Address[];
      }
    ): Promise<TransactionResponse>;
    getMaxAmount(to: Address): Promise<number>;
    getMaxAmountAdvanced(
      to: Address,
      options?: {
        token?: Address;
        useWrappedBalances?: boolean;
        fromTokens?: Address[];
        toTokens?: Address[];
        excludeFromTokens?: Address[];
        excludeToTokens?: Address[];
      }
    ): Promise<number>;
  };

  // Trust methods
  trust: {
    add(avatar: Address | Address[], expiry?: bigint): Promise<TransactionResponse>;
    remove(avatar: Address | Address[]): Promise<TransactionResponse>;
    isTrusting(otherAvatar: Address): Promise<boolean>;
    isTrustedBy(otherAvatar: Address): Promise<boolean>;
    getAll(): Promise<TrustRelationRow[]>;
  };

  // Minting methods
  personalToken: {
    getAvailableAmount(): Promise<number>;
    mint(): Promise<TransactionResponse>;
    stop(): Promise<TransactionResponse>;
  };

  // Profile methods
  profile: {
    get(): Promise<Profile | undefined>;
    update(profile: Profile): Promise<string>;
    updateMetadata(cid: string): Promise<TransactionResponse>;
    registerShortName(nonce: number): Promise<TransactionResponse>;
  };

  // History methods
  history: {
    getTransactions(pageSize: number): Promise<CirclesQuery<TransactionHistoryRow>>;
  };

  // Group token methods
  groupToken: {
    mint(
      group: Address,
      collateral: Address[],
      amounts: bigint[],
      data: Uint8Array
    ): Promise<TransactionResponse>;
    redeem(
      group: Address,
      collaterals: Address[],
      amounts: bigint[]
    ): Promise<TransactionResponse>;
    redeemAuto(group: Address, amount: bigint): Promise<TransactionResponse>;
    properties: {
      owner(): Promise<Address>;
      mintHandler(): Promise<Address>;
      redemptionHandler(): Promise<Address>;
      service(): Promise<Address>;
      minimalDeposit(): Promise<bigint>;
      getMembershipConditions(): Promise<Address[]>;
    };
    setProperties: {
      owner(owner: Address): Promise<TransactionResponse>;
      service(service: Address): Promise<TransactionResponse>;
      mintHandler(mintHandler: Address): Promise<TransactionResponse>;
      redemptionHandler(
        redemptionHandler: Address
      ): Promise<TransactionResponse>;
      minimalDeposit(minimalDeposit: bigint): Promise<TransactionResponse>;
      feeCollection(feeCollection: Address): Promise<TransactionResponse>;
      membershipCondition(
        condition: Address,
        enabled: boolean
      ): Promise<TransactionResponse>;
    };
  };

  // Group methods (duplicate of groupToken for backwards compatibility)
  group: {
    properties: {
      owner(): Promise<Address>;
      mintHandler(): Promise<Address>;
      redemptionHandler(): Promise<Address>;
      service(): Promise<Address>;
      minimalDeposit(): Promise<bigint>;
      getMembershipConditions(): Promise<Address[]>;
    };
    setProperties: {
      owner(owner: Address): Promise<TransactionResponse>;
      service(service: Address): Promise<TransactionResponse>;
      mintHandler(mintHandler: Address): Promise<TransactionResponse>;
      redemptionHandler(
        redemptionHandler: Address
      ): Promise<TransactionResponse>;
      minimalDeposit(minimalDeposit: bigint): Promise<TransactionResponse>;
      feeCollection(feeCollection: Address): Promise<TransactionResponse>;
      membershipCondition(
        condition: Address,
        enabled: boolean
      ): Promise<TransactionResponse>;
    };
  };

  // Token wrapping methods
  wrap: {
    asDemurraged(avatarAddress: Address, amount: bigint): Promise<TransactionResponse>;
    asInflationary(avatarAddress: Address, amount: bigint): Promise<TransactionResponse>;
    unwrapDemurraged(
      tokenAddress: Address,
      amount: bigint
    ): Promise<TransactionResponse>;
    unwrapInflationary(
      tokenAddress: Address,
      amount: bigint
    ): Promise<TransactionResponse>;
  };

  // Invitation methods
  invite: {
    human(avatar: Address): Promise<TransactionResponse>;
  };
}

// Re-export ContractRunner for convenience
export type { ContractRunner };

/**
 * Circles data access layer
 * Provides read access to Circles protocol data
 */
export interface CirclesData {
  // TODO: Define data access methods
  getAvatar(address: Address): Promise<any>;
  getTrustRelations(address: Address): Promise<any>;
  getBalances(address: Address): Promise<any>;
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

/**
 * SDK interface for simplified Circles interactions
 */
export interface SdkInterface {
  // Core properties
  contractRunner?: ContractRunner;
  circlesConfig: CirclesConfig;
  data: CirclesData;
  v2Hub: HubV2;
  v2Pathfinder: V2Pathfinder;

  // Avatar management
  getAvatar(avatarAddress: Address): Promise<AvatarInterface>;

  // Registration methods
  register: {
    asHuman(inviter: Address, profile: Profile | string): Promise<AvatarInterface>;
    asOrganization(profile: Profile): Promise<AvatarInterface>;
    asGroup(mint: Address, profile: GroupProfile): Promise<AvatarInterface>;
  };

  // Profile management
  profiles: {
    createOrUpdate(profile: Profile | string): Promise<TransactionResponse>;
    get(cid: string): Promise<Profile | undefined>;
  };

  // Token utilities
  tokens: {
    getInflationaryWrapper(address: Address): Promise<any>;
    getDemurragedWrapper(address: Address): Promise<any>;
  };

  // Group utilities
  groups: {
    getType(avatar: Address): Promise<GroupType | undefined>;
  };
}

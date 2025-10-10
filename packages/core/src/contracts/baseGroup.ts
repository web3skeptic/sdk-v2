import { Contract } from './contract';
import { baseGroupAbi } from '@circles-sdk/abis';
import type { Address, TransactionRequest, Hex } from '@circles-sdk/types';

/**
 * BaseGroup Contract Wrapper
 * Provides type-safe methods for interacting with Circles BaseGroup contracts
 *
 * Note: BaseGroup contracts have multiple instances (not a singleton).
 * Create instances with specific contract addresses.
 *
 * @example
 * ```typescript
 * const baseGroup = new BaseGroupContract({
 *   address: '0x...', // specific BaseGroup instance address
 *   rpcUrl: 'https://rpc.gnosischain.com'
 * });
 * ```
 */
export class BaseGroupContract extends Contract<typeof baseGroupAbi> {
  constructor(config: { address: Address; rpcUrl: string }) {
    super({
      address: config.address,
      abi: baseGroupAbi,
      rpcUrl: config.rpcUrl,
    });
  }

  /**
   * Get the BaseMintHandler contract address
   */
  async BASE_MINT_HANDLER(): Promise<Address> {
    return this.read('BASE_MINT_HANDLER') as Promise<Address>;
  }

  /**
   * Get the base mint policy address (constant)
   */
  async BASE_MINT_POLICY(): Promise<Address> {
    return this.read('BASE_MINT_POLICY') as Promise<Address>;
  }

  /**
   * Get the BaseTreasury contract address
   */
  async BASE_TREASURY(): Promise<Address> {
    return this.read('BASE_TREASURY') as Promise<Address>;
  }

  /**
   * Get the Hub contract address (constant)
   */
  async HUB(): Promise<Address> {
    return this.read('HUB') as Promise<Address>;
  }

  /**
   * Get the LiftERC20 contract address (constant)
   */
  async LIFT_ERC20(): Promise<Address> {
    return this.read('LIFT_ERC20') as Promise<Address>;
  }

  /**
   * Get the maximum number of membership conditions allowed (constant)
   */
  async MAX_CONDITIONS(): Promise<bigint> {
    return this.read('MAX_CONDITIONS') as Promise<bigint>;
  }

  /**
   * Get the NameRegistry contract address (constant)
   */
  async NAME_REGISTRY(): Promise<Address> {
    return this.read('NAME_REGISTRY') as Promise<Address>;
  }

  /**
   * Get the current owner address
   */
  async owner(): Promise<Address> {
    return this.read('owner') as Promise<Address>;
  }

  /**
   * Get the current service address
   */
  async service(): Promise<Address> {
    return this.read('service') as Promise<Address>;
  }

  /**
   * Get the current fee collection address
   */
  async feeCollection(): Promise<Address> {
    return this.read('feeCollection') as Promise<Address>;
  }

  /**
   * Get all membership condition addresses
   */
  async getMembershipConditions(): Promise<readonly Address[]> {
    return this.read('getMembershipConditions') as Promise<readonly Address[]>;
  }

  /**
   * Get a membership condition address by index
   */
  async membershipConditions(index: bigint): Promise<Address> {
    return this.read('membershipConditions', [index]) as Promise<Address>;
  }

  /**
   * Create a transaction to set a new owner
   */
  setOwner(newOwner: Address, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('setOwner', [newOwner]),
      value,
    };
  }

  /**
   * Create a transaction to set a new service address
   */
  setService(newService: Address, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('setService', [newService]),
      value,
    };
  }

  /**
   * Create a transaction to set a new fee collection address
   */
  setFeeCollection(newFeeCollection: Address, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('setFeeCollection', [newFeeCollection]),
      value,
    };
  }

  /**
   * Create a transaction to enable or disable a membership condition
   */
  setMembershipCondition(
    condition: Address,
    enabled: boolean,
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('setMembershipCondition', [condition, enabled]),
      value,
    };
  }

  /**
   * Create a transaction to trust a member (without membership checks)
   */
  trust(trustReceiver: Address, expiry: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('trust', [trustReceiver, expiry]),
      value,
    };
  }

  /**
   * Create a transaction to trust or untrust a batch of members with membership condition checks
   */
  trustBatchWithConditions(
    members: readonly Address[],
    expiry: bigint,
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('trustBatchWithConditions', [members, expiry]),
      value,
    };
  }

  /**
   * Create a transaction to update the metadata digest
   */
  updateMetadataDigest(metadataDigest: Hex, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('updateMetadataDigest', [metadataDigest]),
      value,
    };
  }

  /**
   * Create a transaction to register a short name with a specific nonce
   */
  registerShortNameWithNonce(nonce: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('registerShortNameWithNonce', [nonce]),
      value,
    };
  }
}

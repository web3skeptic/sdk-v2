import { Contract } from './contract';
import { demurrageCirclesAbi } from '../abi';
import type { Address, TransactionRequest, Hex } from '../types';

/**
 * DemurrageCircles Contract Wrapper
 * Provides type-safe methods for interacting with Circles DemurrageCircles (ERC20 wrapper) contracts
 *
 * Note: DemurrageCircles contracts have multiple instances (not a singleton).
 * Create instances with specific contract addresses.
 *
 * @example
 * ```typescript
 * const demurrageCircles = new DemurrageCirclesContract({
 *   address: '0x...', // specific DemurrageCircles instance address
 *   rpcUrl: 'https://rpc.gnosischain.com'
 * });
 * ```
 */
export class DemurrageCirclesContract extends Contract<typeof demurrageCirclesAbi> {
  constructor(config: { address: Address; rpcUrl: string }) {
    super({
      address: config.address,
      abi: demurrageCirclesAbi,
      rpcUrl: config.rpcUrl,
    });
  }

  /**
   * Get the EIP-712 domain separator
   */
  async DOMAIN_SEPARATOR(): Promise<Hex> {
    return this.read('DOMAIN_SEPARATOR') as Promise<Hex>;
  }

  /**
   * Get the avatar address associated with this wrapper
   */
  async avatar(): Promise<Address> {
    return this.read('avatar') as Promise<Address>;
  }

  /**
   * Get the Circles identifier (token ID)
   */
  async circlesIdentifier(): Promise<bigint> {
    return this.read('circlesIdentifier') as Promise<bigint>;
  }

  /**
   * Get the Hub contract address
   */
  async hub(): Promise<Address> {
    return this.read('hub') as Promise<Address>;
  }

  /**
   * Get the NameRegistry contract address
   */
  async nameRegistry(): Promise<Address> {
    return this.read('nameRegistry') as Promise<Address>;
  }

  /**
   * Get the inflation day zero timestamp
   */
  async inflationDayZero(): Promise<bigint> {
    return this.read('inflationDayZero') as Promise<bigint>;
  }

  /**
   * Get the token name
   */
  async name(): Promise<string> {
    return this.read('name') as Promise<string>;
  }

  /**
   * Get the token symbol
   */
  async symbol(): Promise<string> {
    return this.read('symbol') as Promise<string>;
  }

  /**
   * Get the token decimals
   */
  async decimals(): Promise<number> {
    return this.read('decimals') as Promise<number>;
  }

  /**
   * Get the total supply
   */
  async totalSupply(): Promise<bigint> {
    return this.read('totalSupply') as Promise<bigint>;
  }

  /**
   * Get the balance of an account
   */
  async balanceOf(account: Address): Promise<bigint> {
    return this.read('balanceOf', [account]) as Promise<bigint>;
  }

  /**
   * Get the balance of an account on a specific day
   * @returns [balanceOnDay, discountCost]
   */
  async balanceOfOnDay(account: Address, day: bigint): Promise<readonly [bigint, bigint]> {
    return this.read('balanceOfOnDay', [account, day]) as Promise<readonly [bigint, bigint]>;
  }

  /**
   * Get the discounted balance information for an account
   * @returns [balance, lastUpdatedDay]
   */
  async discountedBalances(account: Address): Promise<readonly [bigint, bigint]> {
    return this.read('discountedBalances', [account]) as Promise<readonly [bigint, bigint]>;
  }

  /**
   * Get the allowance of a spender for an owner
   */
  async allowance(owner: Address, spender: Address): Promise<bigint> {
    return this.read('allowance', [owner, spender]) as Promise<bigint>;
  }

  /**
   * Get the nonce for permit signatures
   */
  async nonces(owner: Address): Promise<bigint> {
    return this.read('nonces', [owner]) as Promise<bigint>;
  }

  /**
   * Calculate the current day from a timestamp
   */
  async day(timestamp: bigint): Promise<bigint> {
    return this.read('day', [timestamp]) as Promise<bigint>;
  }

  /**
   * Convert a demurraged value to inflationary value
   */
  async convertDemurrageToInflationaryValue(demurrageValue: bigint, dayUpdated: bigint): Promise<bigint> {
    return this.read('convertDemurrageToInflationaryValue', [demurrageValue, dayUpdated]) as Promise<bigint>;
  }

  /**
   * Convert an inflationary value to demurraged value
   */
  async convertInflationaryToDemurrageValue(inflationaryValue: bigint, day: bigint): Promise<bigint> {
    return this.read('convertInflationaryToDemurrageValue', [inflationaryValue, day]) as Promise<bigint>;
  }

  /**
   * Convert batch of demurraged values to inflationary values
   */
  async convertBatchDemurrageToInflationaryValues(demurrageValues: readonly bigint[], dayUpdated: bigint): Promise<readonly bigint[]> {
    return this.read('convertBatchDemurrageToInflationaryValues', [demurrageValues, dayUpdated]) as Promise<readonly bigint[]>;
  }

  /**
   * Convert batch of inflationary values to demurraged values
   */
  async convertBatchInflationaryToDemurrageValues(inflationaryValues: readonly bigint[], day: bigint): Promise<readonly bigint[]> {
    return this.read('convertBatchInflationaryToDemurrageValues', [inflationaryValues, day]) as Promise<readonly bigint[]>;
  }

  /**
   * Convert avatar address to token ID
   */
  async toTokenId(avatar: Address): Promise<bigint> {
    return this.read('toTokenId', [avatar]) as Promise<bigint>;
  }

  /**
   * Get EIP-712 domain information
   */
  async eip712Domain(): Promise<readonly [Hex, string, string, bigint, Address, Hex, readonly bigint[]]> {
    return this.read('eip712Domain') as Promise<readonly [Hex, string, string, bigint, Address, Hex, readonly bigint[]]>;
  }

  /**
   * Check if interface is supported
   */
  async supportsInterface(interfaceId: Hex): Promise<boolean> {
    return this.read('supportsInterface', [interfaceId]) as Promise<boolean>;
  }

  /**
   * Transfer tokens to another address
   */
  transfer(to: Address, amount: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('transfer', [to, amount]),
      value,
    };
  }

  /**
   * Transfer tokens from one address to another
   */
  transferFrom(from: Address, to: Address, amount: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('transferFrom', [from, to, amount]),
      value,
    };
  }

  /**
   * Approve a spender to spend tokens
   */
  approve(spender: Address, amount: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('approve', [spender, amount]),
      value,
    };
  }

  /**
   * Increase the allowance of a spender
   */
  increaseAllowance(spender: Address, addedValue: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('increaseAllowance', [spender, addedValue]),
      value,
    };
  }

  /**
   * Decrease the allowance of a spender
   */
  decreaseAllowance(spender: Address, subtractedValue: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('decreaseAllowance', [spender, subtractedValue]),
      value,
    };
  }

  /**
   * Unwrap demurraged Circles back to ERC1155
   */
  unwrap(amount: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('unwrap', [amount]),
      value,
    };
  }

  /**
   * Permit approval via signature (EIP-2612)
   */
  permit(
    owner: Address,
    spender: Address,
    permitValue: bigint,
    deadline: bigint,
    v: number,
    r: Hex,
    s: Hex,
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('permit', [owner, spender, permitValue, deadline, v, r, s]),
      value,
    };
  }
}

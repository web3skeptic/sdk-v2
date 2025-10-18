import { Contract } from './contract';
import { hubV2Abi } from '@circles-sdk/abis';
import type { Address, TransactionRequest, Hex } from '@circles-sdk/types';

/**
 * HubV2 Contract Wrapper
 * Provides type-safe methods for interacting with Circles HubV2 contract
 */
export class HubV2Contract extends Contract<typeof hubV2Abi> {
  constructor(config: { address: Address; rpcUrl: string }) {
    super({
      address: config.address,
      abi: hubV2Abi,
      rpcUrl: config.rpcUrl,
    });
  }
  /**
   * Check if an address is registered as a human
   */
  async isHuman(address: Address): Promise<boolean> {
    return this.read('isHuman', [address]) as Promise<boolean>;
  }

  /**
   * Check if an address is registered as a group
   */
  async isGroup(address: Address): Promise<boolean> {
    return this.read('isGroup', [address]) as Promise<boolean>;
  }

  /**
   * Check if an address is registered as an organization
   */
  async isOrganization(address: Address): Promise<boolean> {
    return this.read('isOrganization', [address]) as Promise<boolean>;
  }

  /**
   * Get balance of a specific token ID for an account
   */
  async balanceOf(account: Address, id: bigint): Promise<bigint> {
    return this.read('balanceOf', [account, id]) as Promise<bigint>;
  }

  /**
   * Get balances of multiple token IDs for multiple accounts
   */
  async balanceOfBatch(accounts: readonly Address[], ids: readonly bigint[]): Promise<readonly bigint[]> {
    return this.read('balanceOfBatch', [accounts, ids]) as Promise<readonly bigint[]>;
  }

  /**
   * Get total supply of a specific token ID
   */
  async totalSupply(id: bigint): Promise<bigint> {
    return this.read('totalSupply', [id]) as Promise<bigint>;
  }

  /**
   * Check if an address trusts another address
   */
  async isTrusted(truster: Address, trustee: Address): Promise<boolean> {
    return this.read('isTrusted', [truster, trustee]) as Promise<boolean>;
  }

  /**
   * Convert token ID to avatar address
   */
  async toTokenId(avatar: Address): Promise<bigint> {
    return this.read('toTokenId', [avatar]) as Promise<bigint>;
  }

  /**
   * Calculate issuance for a human avatar
   */
  async calculateIssuance(human: Address): Promise<readonly [bigint, bigint, bigint]> {
    return this.read('calculateIssuance', [human]) as Promise<readonly [bigint, bigint, bigint]>;
  }

  /**
   * Get the current day based on timestamp
   */
  async day(timestamp: bigint): Promise<bigint> {
    return this.read('day', [timestamp]) as Promise<bigint>;
  }

  /**
   * Get inflation day zero
   */
  async inflationDayZero(): Promise<bigint> {
    return this.read('inflationDayZero') as Promise<bigint>;
  }

  /**
   * Check if a human has stopped their Circles minting
   * @param human - The address to check
   * @param options - Optional call options (e.g., { from: Address })
   */
  async stopped(human: Address, options?: { from?: Address }): Promise<boolean> {
    return this.read('stopped', [human], options) as Promise<boolean>;
  }

  /**
   * Create a personal mint transaction
   * Mints personal Circles tokens for the caller
   */
  personalMint(value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('personalMint', []),
      value,
    };
  }

  /**
   * Create a group mint transaction
   * Mints group tokens backed by collateral from avatars
   *
   * @param group - The group address to mint tokens for
   * @param collateralAvatars - Array of avatar addresses providing collateral
   * @param amounts - Array of amounts corresponding to each collateral avatar
   * @param data - Additional data to pass to the contract (use '0x' for no data)
   * @param value - ETH value to send with transaction (default: 0)
   */
  groupMint(
    group: Address,
    collateralAvatars: readonly Address[],
    amounts: readonly bigint[],
    data: Hex = '0x',
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('groupMint', [group, collateralAvatars, amounts, data]),
      value,
    };
  }

  /**
   * Create a trust transaction
   * Trust another address until the specified expiry time
   */
  trust(trustReceiver: Address, expiry: bigint, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('trust', [trustReceiver, expiry]),
      value,
    };
  }

  /**
   * Create a register human transaction
   */
  registerHuman(inviter: Address, metadataDigest: Hex, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('registerHuman', [inviter, metadataDigest]),
      value,
    };
  }

  /**
   * Create a register organization transaction
   */
  registerOrganization(name: string, metadataDigest: Hex, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('registerOrganization', [name, metadataDigest]),
      value,
    };
  }

  /**
   * Create a register group transaction
   */
  registerGroup(
    mint: Address,
    name: string,
    symbol: string,
    metadataDigest: Hex,
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('registerGroup', [mint, name, symbol, metadataDigest]),
      value,
    };
  }

  /**
   * Create a safe transfer transaction
   */
  safeTransferFrom(
    from: Address,
    to: Address,
    id: bigint,
    amount: bigint,
    data: Hex = '0x',
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('safeTransferFrom', [from, to, id, amount, data]),
      value,
    };
  }

  /**
   * Create a batch transfer transaction
   */
  safeBatchTransferFrom(
    from: Address,
    to: Address,
    ids: readonly bigint[],
    amounts: readonly bigint[],
    data: Hex = '0x',
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('safeBatchTransferFrom', [from, to, ids, amounts, data]),
      value,
    };
  }

  /**
   * Create an approval for all transaction
   */
  setApprovalForAll(operator: Address, approved: boolean, value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('setApprovalForAll', [operator, approved]),
      value,
    };
  }

  /**
   * Create a burn transaction
   */
  burn(id: bigint, amount: bigint, data: Hex = '0x', value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('burn', [id, amount, data]),
      value,
    };
  }

  /**
   * Create a stop transaction
   * Permanently stops the ability to mint new personal tokens
   * WARNING: This action is irreversible!
   */
  stop(value: bigint = BigInt(0)): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('stop', []),
      value,
    };
  }

  /**
   * Create a wrap transaction
   * Wraps ERC1155 Circles tokens into ERC20 format
   *
   * @param avatar - The avatar address whose tokens to wrap
   * @param amount - The amount to wrap
   * @param circlesType - The type of wrapper (0 for Demurrage, 1 for Inflationary)
   * @param value - ETH value to send with transaction (default: 0)
   * @returns Transaction request that will return the wrapper address when executed
   */
  wrap(
    avatar: Address,
    amount: bigint,
    circlesType: number, // @todo implement enum
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('wrap', [avatar, amount, circlesType]),
      value,
    };
  }
}

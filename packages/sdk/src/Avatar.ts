import type { Address, Profile, TransactionResponse, TransactionRequest } from '@circles-sdk/types';
import type { Core } from '@circles-sdk/core';
import type {
  Observable,
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  CirclesEvent,
  CirclesQuery,
  AvatarInterface,
  ContractRunner,
} from './types';

// Type aliases for transaction responses
export type TransactionReceipt = TransactionResponse;
export type ContractTransactionReceipt = TransactionResponse;

/**
 * HumanAvatar class implementation
 * Provides a simplified, user-friendly wrapper around Circles protocol for human avatars
 *
 * This class represents a human avatar in the Circles ecosystem and provides
 * methods for managing trust relationships, personal token minting, transfers, and more.
 */
// @todo get rid of the common interface for groups and humans
export class HumanAvatar implements AvatarInterface {
  public readonly address: Address;
  public readonly avatarInfo: AvatarRow | undefined;
  public readonly core: Core;
  public readonly contractRunner?: ContractRunner;
  public readonly events: Observable<CirclesEvent>;

  constructor(
    address: Address,
    core: Core,
    contractRunner?: ContractRunner,
    avatarInfo?: AvatarRow
  ) {
    this.address = address;
    this.core = core;
    this.contractRunner = contractRunner;
    this.avatarInfo = avatarInfo;

    // TODO: Implement event streaming
    this.events = {
      subscribe: () => {
        throw new Error('Event streaming not yet implemented');
      },
    };
  }

  /**
   * Helper method to ensure contract runner is available
   * @throws Error if contract runner is not available
   */
  private ensureContractRunner(): ContractRunner {
    if (!this.contractRunner) {
      throw new Error(
        'Contract runner not available. Please provide a ContractRunner when creating the SDK instance.'
      );
    }
    return this.contractRunner;
  }

  /**
   * Execute a batch of transaction requests sequentially
   * For EOA (Externally Owned Accounts), this sends transactions one after another
   *
   * @param transactions Array of transaction requests to execute
   * @returns Array of transaction responses
   *
   * @example
   * ```typescript
   * const txs = [
   *   core.hubV2.trust(avatar1, expiry),
   *   core.hubV2.trust(avatar2, expiry),
   * ];
   * const receipts = await avatar.executeBatch(txs);
   * ```
   */
  async executeBatch(transactions: TransactionRequest[]): Promise<TransactionResponse[]> {
    const runner = this.ensureContractRunner();

    if (!runner.sendTransaction) {
      throw new Error('Contract runner does not support sendTransaction');
    }

    const receipts: TransactionResponse[] = [];

    // Execute transactions sequentially
    // For EOA, this is the standard approach
    // Future: Could be optimized with multicall or meta-transactions
    for (const tx of transactions) {
      const receipt = await runner.sendTransaction(tx);
      receipts.push(receipt);
    }

    return receipts;
  }

  /**
   * Execute a single transaction
   * @param transaction Single transaction request
   * @returns Transaction response
   */
  async executeTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;

  /**
   * Execute a batch of transactions
   * @param transactions Array of transaction requests
   * @returns Array of transaction responses
   */
  async executeTransaction(transactions: TransactionRequest[]): Promise<TransactionResponse[]>;

  /**
   * Execute a single transaction or batch of transactions
   * Type overloads ensure correct return type based on input
   *
   * @param transactions Single transaction or array of transactions
   * @returns Single response or array of responses
   */
  async executeTransaction(
    transactions: TransactionRequest | TransactionRequest[]
  ): Promise<TransactionResponse | TransactionResponse[]> {
    if (Array.isArray(transactions)) {
      if (transactions.length === 0) {
        throw new Error('No transactions provided');
      }
      return await this.executeBatch(transactions);
    }

    // Single transaction
    const runner = this.ensureContractRunner();
    if (!runner.sendTransaction) {
      throw new Error('Contract runner does not support sendTransaction');
    }
    return await runner.sendTransaction(transactions);
  }

  // Balance methods
  public readonly balances = {
    getTotal: async (): Promise<number> => {
      // TODO: Implement total balance calculation
      throw new Error('balances.getTotal() not yet implemented');
    },

    getDetailed: async (): Promise<TokenBalanceRow[]> => {
      // TODO: Implement detailed balance fetching
      throw new Error('balances.getDetailed() not yet implemented');
    },

    getGasToken: async (): Promise<bigint> => {
      // TODO: Implement gas token balance fetching
      throw new Error('balances.getGasToken() not yet implemented');
    },

    getTotalSupply: async (): Promise<bigint> => {
      // TODO: Implement total supply fetching
      throw new Error('balances.getTotalSupply() not yet implemented');
    },
  };

  // Transfer methods
  public readonly transfer = {
    send: async (to: Address, amount: number | bigint): Promise<TransactionReceipt> => {
      // TODO: Implement simple transfer
      throw new Error('transfer.send() not yet implemented');
    },

    advanced: async (
      to: Address,
      amount: number | bigint,
      options?: any
    ): Promise<TransactionReceipt> => {
      // TODO: Implement advanced transfer
      throw new Error('transfer.advanced() not yet implemented');
    },

    getMaxAmount: async (to: Address): Promise<number> => {
      // TODO: Implement max amount calculation
      throw new Error('transfer.getMaxAmount() not yet implemented');
    },

    getMaxAmountAdvanced: async (to: Address, options?: any): Promise<number> => {
      // TODO: Implement advanced max amount calculation
      throw new Error('transfer.getMaxAmountAdvanced() not yet implemented');
    },
  };

  // Trust methods
  public readonly trust = {
    /**
     * Trust another avatar or multiple avatars
     * Uses batch execution for multiple avatars (sequential transactions for EOA)
     *
     * @param avatar Single avatar address or array of avatar addresses
     * @param expiry Trust expiry timestamp (in seconds since epoch). Defaults to max uint96 for indefinite trust
     * @returns Transaction response (last transaction if multiple avatars)
     *
     * @example
     * ```typescript
     * // Trust single avatar indefinitely
     * await avatar.trust.add('0x123...');
     *
     * // Trust with custom expiry
     * const oneYear = BigInt(Date.now() / 1000 + 31536000);
     * await avatar.trust.add('0x123...', oneYear);
     *
     * // Trust multiple avatars
     * await avatar.trust.add(['0x123...', '0x456...', '0x789...']);
     * ```
     */
    add: async (
      avatar: Address | Address[],
      expiry?: bigint
    ): Promise<TransactionReceipt> => {
      // Default to max uint96 for indefinite trust
      const trustExpiry = expiry ?? BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFF');

      // Prepare transaction(s)
      const avatars = Array.isArray(avatar) ? avatar : [avatar];

      if (avatars.length === 0) {
        throw new Error('No avatars provided to trust');
      }

      // Create trust transactions for all avatars
      const transactions = avatars.map((trustee) =>
        this.core.hubV2.trust(trustee, trustExpiry)
      );

      // Execute using batch helper - returns last receipt for API compatibility
      const receipts = await this.executeTransaction(transactions);
      return receipts[receipts.length - 1];
    },

    /**
     * Remove trust from another avatar or multiple avatars
     * This is done by setting the trust expiry to 0
     * Uses batch execution for multiple avatars (sequential transactions for EOA)
     *
     * @param avatar Single avatar address or array of avatar addresses
     * @returns Transaction response (last transaction if multiple avatars)
     *
     * @example
     * ```typescript
     * // Remove trust from single avatar
     * await avatar.trust.remove('0x123...');
     *
     * // Remove trust from multiple avatars
     * await avatar.trust.remove(['0x123...', '0x456...', '0x789...']);
     * ```
     */
    // @todo return list of transaction receipts
    // @todo safe runner, remove eoa support
    remove: async (avatar: Address | Address[]): Promise<TransactionReceipt> => {
      // Untrust by setting expiry to 0
      const untrustExpiry = BigInt(0);

      // Prepare transaction(s)
      const avatars = Array.isArray(avatar) ? avatar : [avatar];

      if (avatars.length === 0) {
        throw new Error('No avatars provided to untrust');
      }

      // Create untrust transactions for all avatars
      const transactions = avatars.map((trustee) =>
        this.core.hubV2.trust(trustee, untrustExpiry)
      );

      // Execute using batch helper - returns last receipt for API compatibility
      const receipts = await this.executeTransaction(transactions);
      return receipts[receipts.length - 1];
    },

    /**
     * Check if this avatar trusts another avatar
     * @param otherAvatar The avatar address to check
     * @returns True if this avatar trusts the other avatar
     *
     * @example
     * ```typescript
     * const trusting = await avatar.trust.isTrusting('0x123...');
     * if (trusting) {
     *   console.log('You trust this avatar');
     * }
     * ```
     */
    isTrusting: async (otherAvatar: Address): Promise<boolean> => {
      return await this.core.hubV2.isTrusted(this.address, otherAvatar);
    },

    /**
     * Check if another avatar trusts this avatar
     * @param otherAvatar The avatar address to check
     * @returns True if the other avatar trusts this avatar
     *
     * @example
     * ```typescript
     * const trustedBy = await avatar.trust.isTrustedBy('0x123...');
     * if (trustedBy) {
     *   console.log('This avatar trusts you');
     * }
     * ```
     */
    isTrustedBy: async (otherAvatar: Address): Promise<boolean> => {
      return await this.core.hubV2.isTrusted(otherAvatar, this.address);
    },

    getAll: async (): Promise<TrustRelationRow[]> => {
      // TODO: Implement trust relations fetching
      throw new Error('trust.getAll() not yet implemented');
    },
  };

  // Personal token / Minting methods
  public readonly personalToken = {
    /**
     * Get the available amount of personal tokens that can be minted
     * @returns Amount in CRC (human-readable format)
     */
    getAvailableAmount: async (): Promise<number> => {
      // TODO: Implement mintable amount calculation using calculateIssuance
      throw new Error('personalToken.getAvailableAmount() not yet implemented');
    },

    /**
     * Mint personal Circles tokens
     * This claims all available personal tokens that have accrued since last mint
     *
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * const receipt = await avatar.personalToken.mint();
     * console.log('Minted tokens, tx hash:', receipt.hash);
     * ```
     */
    mint: async (): Promise<ContractTransactionReceipt> => {
      const mintTx = this.core.hubV2.personalMint();
      return await this.executeTransaction(mintTx);
    },

    /**
     * Stop personal token minting
     * This permanently stops the ability to mint new personal tokens
     *
     * WARNING: This action is irreversible!
     *
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * const receipt = await avatar.personalToken.stop();
     * console.log('Stopped minting, tx hash:', receipt.hash);
     * ```
     */
    stop: async (): Promise<ContractTransactionReceipt> => {
      // Use the stop method from core
      const stopTx = this.core.hubV2.stop();
      return await this.executeTransaction(stopTx);
    },
  };

  // Profile methods
  public readonly profile = {
    get: async (): Promise<Profile | undefined> => {
      // TODO: Implement profile fetching
      throw new Error('profile.get() not yet implemented');
    },

    update: async (profile: Profile): Promise<string> => {
      // TODO: Implement profile update
      throw new Error('profile.update() not yet implemented');
    },

    updateMetadata: async (cid: string): Promise<ContractTransactionReceipt> => {
      // TODO: Implement metadata update
      throw new Error('profile.updateMetadata() not yet implemented');
    },

    registerShortName: async (nonce: number): Promise<ContractTransactionReceipt> => {
      // TODO: Implement short name registration
      throw new Error('profile.registerShortName() not yet implemented');
    },
  };

  // History methods
  public readonly history = {
    getTransactions: async (
      pageSize: number
    ): Promise<CirclesQuery<TransactionHistoryRow>> => {
      // TODO: Implement transaction history fetching
      throw new Error('history.getTransactions() not yet implemented');
    },
  };

  // Group token methods
  public readonly groupToken = {
    mint: async (
      group: Address,
      collateral: Address[],
      amounts: bigint[],
      data: Uint8Array
    ): Promise<ContractTransactionReceipt> => {
      // TODO: Implement group minting
      throw new Error('groupToken.mint() not yet implemented');
    },

    redeem: async (
      group: Address,
      collaterals: Address[],
      amounts: bigint[]
    ): Promise<TransactionReceipt> => {
      // TODO: Implement group redemption
      throw new Error('groupToken.redeem() not yet implemented');
    },

    redeemAuto: async (
      group: Address,
      amount: bigint
    ): Promise<TransactionReceipt> => {
      // TODO: Implement automatic redemption
      throw new Error('groupToken.redeemAuto() not yet implemented');
    },

    properties: {
      owner: async (): Promise<Address> => {
        throw new Error('groupToken.properties.owner() not yet implemented');
      },
      mintHandler: async (): Promise<Address> => {
        throw new Error('groupToken.properties.mintHandler() not yet implemented');
      },
      redemptionHandler: async (): Promise<Address> => {
        throw new Error('groupToken.properties.redemptionHandler() not yet implemented');
      },
      service: async (): Promise<Address> => {
        throw new Error('groupToken.properties.service() not yet implemented');
      },
      minimalDeposit: async (): Promise<bigint> => {
        throw new Error('groupToken.properties.minimalDeposit() not yet implemented');
      },
      getMembershipConditions: async (): Promise<Address[]> => {
        throw new Error(
          'groupToken.properties.getMembershipConditions() not yet implemented'
        );
      },
    },

    setProperties: {
      owner: async (owner: Address): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.owner() not yet implemented');
      },
      service: async (service: Address): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.service() not yet implemented');
      },
      mintHandler: async (mintHandler: Address): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.mintHandler() not yet implemented');
      },
      redemptionHandler: async (
        redemptionHandler: Address
      ): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.redemptionHandler() not yet implemented');
      },
      minimalDeposit: async (
        minimalDeposit: bigint
      ): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.minimalDeposit() not yet implemented');
      },
      feeCollection: async (
        feeCollection: Address
      ): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.feeCollection() not yet implemented');
      },
      membershipCondition: async (
        condition: Address,
        enabled: boolean
      ): Promise<ContractTransactionReceipt> => {
        throw new Error('groupToken.setProperties.membershipCondition() not yet implemented');
      },
    },
  };

  // Group methods (alias for groupToken)
  public readonly group = {
    properties: this.groupToken.properties,
    setProperties: this.groupToken.setProperties,
  };

  // Wrap methods
  public readonly wrap = {
    asDemurraged: async (avatarAddress: Address, amount: bigint): Promise<Address> => {
      // TODO: Implement demurraged wrapping
      throw new Error('wrap.asDemurraged() not yet implemented');
    },

    asInflationary: async (avatarAddress: Address, amount: bigint): Promise<Address> => {
      // TODO: Implement inflationary wrapping
      throw new Error('wrap.asInflationary() not yet implemented');
    },

    unwrapDemurraged: async (
      tokenAddress: Address,
      amount: bigint
    ): Promise<ContractTransactionReceipt> => {
      // TODO: Implement demurraged unwrapping
      throw new Error('wrap.unwrapDemurraged() not yet implemented');
    },

    unwrapInflationary: async (
      avatarAddress: Address,
      amount: bigint
    ): Promise<ContractTransactionReceipt> => {
      // TODO: Implement inflationary unwrapping
      throw new Error('wrap.unwrapInflationary() not yet implemented');
    },
  };

  // Invite methods
  public readonly invite = {
    human: async (avatar: Address): Promise<TransactionReceipt> => {
      // TODO: Implement invitation
      throw new Error('invite.human() not yet implemented');
    },
  };
}

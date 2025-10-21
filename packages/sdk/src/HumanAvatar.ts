import type {
  Address,
  AdvancedTransferOptions,
  Profile,
  TransactionResponse,
  FindPathParams,
} from '@circles-sdk/types';
import type { Core } from '@circles-sdk/core';
import type {
  Observable,
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  CirclesEvent,
  CirclesQuery,
  ContractRunner,
} from './types';
import { cidV0ToHex, bytesToHex } from '@circles-sdk/utils';
import { Profiles } from '@circles-sdk/profiles';
import {
  CirclesType,
  DemurrageCirclesContract,
  InflationaryCirclesContract
} from '@circles-sdk/core';
import { encodeAbiParameters, parseAbiParameters, encodeFunctionData } from 'viem';
import { TransferBuilder } from '@circles-sdk/transfers';
import { CirclesRpc } from '@circles-sdk/rpc';

// Type aliases for transaction responses
export type TransactionReceipt = TransactionResponse;
export type ContractTransactionReceipt = TransactionResponse;

/**
 * Advanced pathfinding options (reuses FindPathParams optional fields)
 */
export type PathfindingOptions = Omit<FindPathParams, 'from' | 'to' | 'targetFlow'>;

/**
 * HumanAvatar class implementation
 * Provides a simplified, user-friendly wrapper around Circles protocol for human avatars
 *
 * This class represents a human avatar in the Circles ecosystem and provides
 * methods for managing trust relationships, personal token minting, transfers, and more.
 */
export class HumanAvatar {
  public readonly address: Address;
  public readonly avatarInfo: AvatarRow | undefined;
  public readonly core: Core;
  public readonly contractRunner?: ContractRunner;
  public readonly events: Observable<CirclesEvent>;
  private readonly runner: ContractRunner;
  private readonly profiles: Profiles;
  private readonly transferBuilder: TransferBuilder;
  private readonly rpc: CirclesRpc;
  private _cachedProfile?: Profile;
  private _cachedProfileCid?: string;

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

    // Validate contract runner is available
    if (!contractRunner) {
      throw new Error(
        'Contract runner not available. Please provide a ContractRunner when creating the SDK instance.'
      );
    }

    if (!contractRunner.sendTransaction) {
      throw new Error('Contract runner does not support sendTransaction');
    }

    this.runner = contractRunner;

    // Initialize profiles client with the profile service URL from config
    this.profiles = new Profiles(core.config.profileServiceUrl);

    // Initialize RPC client
    this.rpc = new CirclesRpc(core.config.circlesRpcUrl);

    // Initialize transfer builder
    this.transferBuilder = new TransferBuilder(core);

    // TODO: Implement event streaming
    this.events = {
      subscribe: () => {
        throw new Error('Event streaming not yet implemented');
      },
    };
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
    /**
     * Send Circles tokens directly to another address
     * This is a simple direct transfer without pathfinding
     *
     * Supports both ERC1155 (personal/group tokens) and ERC20 (wrapped tokens) transfers.
     * The token type is automatically detected and the appropriate transfer method is used.
     *
     * For transfers using pathfinding (which can use trust network and multiple token types),
     * use transfer.advanced() instead.
     *
     * @param to Recipient address
     * @param amount Amount to transfer (in atto-circles)
     * @param tokenAddress Token address to transfer (defaults to sender's personal token)
     * @param txData Optional transaction data (only used for ERC1155 transfers)
     * @returns Transaction receipt
     *
     * @example
     * ```typescript
     * // Send 100 of your personal CRC directly
     * const receipt = await avatar.transfer.send('0x123...', BigInt(100e18));
     *
     * // Send wrapped tokens
     * const receipt = await avatar.transfer.send('0x123...', BigInt(100e18), '0xWrappedTokenAddress...');
     * ```
     */
    send: async (
      to: Address,
      amount: bigint,
      tokenAddress?: Address,
      txData?: Uint8Array
    ): Promise<TransactionReceipt> => {
      // Default to sender's personal token if not specified
      const token = tokenAddress || this.address;

      // Get token info to determine transfer type
      const tokenInfo = await this.rpc.token.getTokenInfo(token);

      if (!tokenInfo) {
        throw new Error(`Token not found: ${token}`);
      }

      // Define token type sets
      const erc1155Types = new Set(['CrcV2_RegisterHuman', 'CrcV2_RegisterGroup']);
      const erc20Types = new Set([
        'CrcV2_ERC20WrapperDeployed_Demurraged',
        'CrcV2_ERC20WrapperDeployed_Inflationary'
      ]);

      // Route to appropriate transfer method based on token type
      if (erc1155Types.has(tokenInfo.tokenType)) {
        return await this._transferErc1155(token, to, amount, txData);
      } else if (erc20Types.has(tokenInfo.tokenType)) {
        return await this._transferErc20(to, amount, token);
      }

      throw new Error(`Token type ${tokenInfo.tokenType} not supported for direct transfer`);
    },

    advanced: async (
      to: Address,
      amount: number | bigint,
      options?: AdvancedTransferOptions
    ): Promise<TransactionReceipt> => {
      // Construct transfer using TransferBuilder
      const transactions = await this.transferBuilder.constructAdvancedTransfer(
        this.address,
        to,
        amount,
        options
      );

      // Execute the constructed transactions
      return await this.runner.sendTransaction!(transactions);
    },

    getMaxAmount: async (to: Address): Promise<bigint> => {
      return await this.transferBuilder.getMaxAmount(this.address, to);
    },

    getMaxAmountAdvanced: async (to: Address, options?: PathfindingOptions): Promise<bigint> => {
      return await this.transferBuilder.getMaxAmountAdvanced(this.address, to, options);
    },

    /**
     * Replenish unwrapped personal CRC tokens by converting wrapped/other tokens
     *
     * This method uses pathfinding to find the best way to convert your available tokens
     * (including wrapped tokens) into unwrapped ERC1155 personal CRC tokens.
     *
     * Useful when you have wrapped tokens or other people's tokens and want to
     * convert them to your own personal unwrapped tokens for transfers.
     *
     * @param options Optional pathfinding options
     * @returns Transaction receipt
     *
     * @example
     * ```typescript
     * // Convert all available wrapped/other tokens to unwrapped personal CRC
     * const receipt = await avatar.transfer.replenish();
     * console.log('Replenished personal tokens, tx hash:', receipt.hash);
     * ```
     */
    replenish: async (options?: PathfindingOptions): Promise<TransactionReceipt> => {
      // Construct replenish transactions using TransferBuilder
      const transactions = await this.transferBuilder.constructReplenish(
        this.address,
        options
      );

      // If no transactions needed, return early
      if (transactions.length === 0) {
        throw new Error('No tokens available to replenish. You may not have any wrapped tokens or convertible tokens.');
      }

      // Execute the constructed transactions
      return await this.runner.sendTransaction!(transactions);
    },
  };

  // Trust methods
  public readonly trust = {
    /**
     * Trust another avatar or multiple avatars
     *
     * When using Safe runner, all trust operations are executed atomically in a single transaction.
     * When using EOA runner, only single avatars are supported (pass array length 1).
     *
     * @param avatar Single avatar address or array of avatar addresses
     * @param expiry Trust expiry timestamp (in seconds since epoch). Defaults to max uint96 for indefinite trust
     * @returns Transaction response
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
     * // Trust multiple avatars (Safe only - throws error with EOA)
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

      // Send transactions to runner
      return await this.runner.sendTransaction!(transactions);
    },

    /**
     * Remove trust from another avatar or multiple avatars
     * This is done by setting the trust expiry to 0
     *
     * When using Safe runner, all operations are batched atomically.
     * When using EOA runner, only single avatars are supported (pass array length 1).
     *
     * @param avatar Single avatar address or array of avatar addresses
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * // Remove trust from single avatar
     * await avatar.trust.remove('0x123...');
     *
     * // Remove trust from multiple avatars (Safe only)
     * await avatar.trust.remove(['0x123...', '0x456...', '0x789...']);
     * ```
     */
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

      // Send transactions to runner
      return await this.runner.sendTransaction!(transactions);
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

  // Invitation methods
  public readonly invite = {
    /**
     * Invite someone to Circles by escrowing 100 CRC tokens
     *
     * This batches two transactions atomically:
     * 1. Establishes trust with the invitee (with indefinite expiry)
     * 2. Transfers 100 of your personal CRC tokens to the InvitationEscrow contract
     *
     * The tokens are held in escrow until the invitee redeems the invitation by registering.
     *
     * Requirements:
     * - You must have at least 100 CRC available
     * - Invitee must not be already registered in Circles
     * - You can only have one active invitation per invitee
     *
     * @param invitee The address to invite
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * // Invite someone with 100 CRC (automatically establishes trust)
     * await avatar.invite.send('0x123...');
     * ```
     */
    send: async (invitee: Address): Promise<TransactionReceipt> => {
      //@todo add replenish/unwrap logic
      // Create trust transaction (indefinite trust)
      const trustTx = this.core.hubV2.trust(invitee, BigInt('0xFFFFFFFFFFFFFFFFFFFFFFFF'));

      // Get the token ID for this avatar's personal token
      const tokenId = await this.core.hubV2.toTokenId(this.address);

      // ABI-encode the invitee address as 32 bytes
      const encodedInvitee = encodeAbiParameters(
        parseAbiParameters('address'),
        [invitee]
      );

      // Create the safeTransferFrom transaction to the InvitationEscrow contract
      const transferTx = this.core.hubV2.safeTransferFrom(
        this.address,
        this.core.config.invitationEscrowAddress,
        tokenId,
        BigInt(100e18),
        encodedInvitee
      );

      // Batch both transactions: trust + invitation transfer
      return await this.runner.sendTransaction!([trustTx, transferTx]);
    },

    /**
     * Revoke a previously sent invitation
     *
     * This returns the escrowed tokens (with demurrage applied) back to you
     * as wrapped ERC20 tokens.
     *
     * @param invitee The address whose invitation to revoke
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * await avatar.invite.revoke('0x123...');
     * ```
     */
    revoke: async (invitee: Address): Promise<TransactionReceipt> => {
      const revokeTx = this.core.invitationEscrow.revokeInvitation(invitee);
      return await this.runner.sendTransaction!([revokeTx]);
    },

    /**
     * Revoke all active invitations at once
     *
     * This returns all escrowed tokens (with demurrage applied) back to you
     * as wrapped ERC20 tokens in a single transaction.
     *
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * await avatar.invite.revokeAll();
     * ```
     */
    revokeAll: async (): Promise<TransactionReceipt> => {
      const revokeAllTx = this.core.invitationEscrow.revokeAllInvitations();
      return await this.runner.sendTransaction!([revokeAllTx]);
    },

    /**
     * Redeem an invitation received from an inviter
     *
     * This claims the escrowed tokens from a specific inviter and refunds
     * all other inviters' escrows back to them.
     *
     * @param inviter The address of the inviter whose invitation to redeem
     * @returns Transaction response
     *
     * @example
     * ```typescript
     * // Get all inviters first
     * const inviters = await avatar.invite.getInviters();
     *
     * // Redeem invitation from the first inviter
     * await avatar.invite.redeem(inviters[0]);
     * ```
     */
    redeem: async (inviter: Address): Promise<TransactionReceipt> => {
      const redeemTx = this.core.invitationEscrow.redeemInvitation(inviter);
      return await this.runner.sendTransaction!([redeemTx]);
    },

    /**
     * Get all addresses that have sent invitations to you
     *
     * @returns Array of inviter addresses
     *
     * @example
     * ```typescript
     * const inviters = await avatar.invite.getInviters();
     * console.log(`You have ${inviters.length} pending invitations`);
     * ```
     */
    getInviters: async (): Promise<Address[]> => {
      return await this.core.invitationEscrow.getInviters(this.address);
    },

    /**
     * Get all addresses you have invited
     *
     * @returns Array of invitee addresses
     *
     * @example
     * ```typescript
     * const invitees = await avatar.invite.getInvitees();
     * console.log(`You have invited ${invitees.length} people`);
     * ```
     */
    getInvitees: async (): Promise<Address[]> => {
      return await this.core.invitationEscrow.getInvitees(this.address);
    },

    /**
     * Get the escrowed amount and days since escrow for a specific invitation
     *
     * The amount returned has demurrage applied, so it decreases over time.
     *
     * @param inviter The inviter address (when checking invitations you received)
     * @param invitee The invitee address (when checking invitations you sent)
     * @returns Object with escrowedAmount (in atto-circles) and days since escrow
     *
     * @example
     * ```typescript
     * // Check an invitation you sent
     * const { escrowedAmount, days_ } = await avatar.invite.getEscrowedAmount(
     *   avatar.address,
     *   '0xinvitee...'
     * );
     * console.log(`Escrowed: ${CirclesConverter.attoCirclesToCircles(escrowedAmount)} CRC`);
     * console.log(`Days since escrow: ${days_}`);
     *
     * // Check an invitation you received
     * const { escrowedAmount, days_ } = await avatar.invite.getEscrowedAmount(
     *   '0xinviter...',
     *   avatar.address
     * );
     * ```
     */
    getEscrowedAmount: async (inviter: Address, invitee: Address) => {
      return await this.core.invitationEscrow.getEscrowedAmountAndDays(inviter, invitee);
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
      return await this.runner.sendTransaction!([mintTx]);
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
      return await this.runner.sendTransaction!([stopTx]);
    },
  };

  // Profile methods
  public readonly profile = {
    /**
     * Get the profile for this avatar from IPFS
     * Uses caching to avoid redundant fetches for the same CID
     *
     * @returns The profile data, or undefined if no profile is set or fetch fails
     *
     * @example
     * ```typescript
     * const profile = await avatar.profile.get();
     * if (profile) {
     *   console.log('Name:', profile.name);
     *   console.log('Description:', profile.description);
     * }
     * ```
     */
    get: async (): Promise<Profile | undefined> => {
      const profileCid = this.avatarInfo?.cidV0;

      // Return cached profile if CID hasn't changed
      if (this._cachedProfile && this._cachedProfileCid === profileCid) {
        return this._cachedProfile;
      }

      if (!profileCid) {
        return undefined;
      }

      try {
        const profileData = await this.profiles.get(profileCid);
        if (profileData) {
          this._cachedProfile = profileData;
          this._cachedProfileCid = profileCid;
          return this._cachedProfile;
        }
      } catch (e) {
        console.warn(`Couldn't load profile for CID ${profileCid}`, e);
      }

      return undefined;
    },

    /**
     * Update the profile for this avatar
     * This will:
     * 1. Pin the new profile data to IPFS via the profile service
     * 2. Update the metadata digest in the name registry contract
     *
     * @param profile The profile data to update
     * @returns The CID of the newly pinned profile
     *
     * @example
     * ```typescript
     * const profile = {
     *   name: 'Alice',
     *   description: 'Hello, Circles!',
     *   avatarUrl: 'https://example.com/avatar.png'
     * };
     *
     * const cid = await avatar.profile.update(profile);
     * console.log('Profile updated with CID:', cid);
     * ```
     */
    update: async (profile: Profile): Promise<string> => {
      // Step 1: Pin the profile to IPFS and get CID
      const cid = await this.profiles.create(profile);
      if (!cid) {
        throw new Error('Failed to update profile. The profile service did not return a CID.');
      }

      // Step 2: Update the metadata digest in the name registry
      const updateReceipt = await this.profile.updateMetadata(cid);
      if (!updateReceipt) {
        throw new Error('Failed to update profile. The CID was not updated in the name registry.');
      }

      // Update local avatar info if available
      if (this.avatarInfo) {
        this.avatarInfo.cidV0 = cid;
      }

      // Clear cache to force re-fetch
      this._cachedProfile = undefined;
      this._cachedProfileCid = undefined;

      return cid;
    },

    /**
     * Update the metadata digest (CID) in the name registry
     * This updates the on-chain pointer to the profile data stored on IPFS
     *
     * @param cid The IPFS CIDv0 to set as the metadata digest (e.g., "QmXxxx...")
     * @returns Transaction receipt
     *
     * @example
     * ```typescript
     * const receipt = await avatar.profile.updateMetadata('QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG');
     * console.log('Metadata updated, tx hash:', receipt.hash);
     * ```
     */
    updateMetadata: async (cid: string): Promise<ContractTransactionReceipt> => {
      // Convert CIDv0 (base58-encoded multihash) to bytes32 hex format
      // This extracts the 32-byte SHA-256 digest from the CID
      const cidHex = cidV0ToHex(cid);

      const updateTx = this.core.nameRegistry.updateMetadataDigest(cidHex);
      return await this.runner.sendTransaction!([updateTx]);
    },

    /**
     * Register a short name for this avatar using a specific nonce
     * Short names are numeric identifiers that can be used instead of addresses
     *
     * @param nonce The nonce to use for generating the short name
     * @returns Transaction receipt
     *
     * @example
     * ```typescript
     * // Find available nonce first
     * const [shortName, nonce] = await core.nameRegistry.searchShortName(avatar.address);
     * console.log('Available short name:', shortName.toString());
     *
     * // Register it
     * const receipt = await avatar.profile.registerShortName(Number(nonce));
     * console.log('Short name registered, tx hash:', receipt.hash);
     * ```
     */
    registerShortName: async (nonce: number): Promise<ContractTransactionReceipt> => {
      const registerTx = this.core.nameRegistry.registerShortNameWithNonce(BigInt(nonce));
      return await this.runner.sendTransaction!([registerTx]);
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
    asDemurraged: async (avatarAddress: Address, amount: bigint): Promise<TransactionReceipt> => {
      const wrapTx = this.core.hubV2.wrap(avatarAddress, amount, CirclesType.Demurrage);
      return await this.runner.sendTransaction!([wrapTx]);
    },

    asInflationary: async (avatarAddress: Address, amount: bigint): Promise<TransactionReceipt> => {
      const wrapTx = this.core.hubV2.wrap(avatarAddress, amount, CirclesType.Inflation);
      return await this.runner.sendTransaction!([wrapTx]);
    },

    unwrapDemurraged: async (
      tokenAddress: Address,
      amount: bigint
    ): Promise<ContractTransactionReceipt> => {
      const demurrageContract = new DemurrageCirclesContract({
        address: tokenAddress,
        rpcUrl: this.core.rpcUrl
      });
      const unwrapTx = demurrageContract.unwrap(amount);
      return await this.runner.sendTransaction!([unwrapTx]);
    },

    unwrapInflationary: async (
      tokenAddress: Address,
      amount: bigint
    ): Promise<ContractTransactionReceipt> => {
      const inflationaryContract = new InflationaryCirclesContract({
        address: tokenAddress,
        rpcUrl: this.core.rpcUrl
      });
      const unwrapTx = inflationaryContract.unwrap(amount);
      return await this.runner.sendTransaction!([unwrapTx]);
    },
  };

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Transfer ERC1155 tokens using safeTransferFrom
   * @private
   */
  private async _transferErc1155(
    tokenAddress: Address,
    to: Address,
    amount: bigint,
    txData?: Uint8Array
  ): Promise<TransactionReceipt> {
    // Get the token ID for the token address
    const tokenId = await this.core.hubV2.toTokenId(tokenAddress);

    // Convert txData to hex string if provided, otherwise use empty hex
    const data = txData ? bytesToHex(txData) as `0x${string}` : '0x';

    // Create the safeTransferFrom transaction
    const transferTx = this.core.hubV2.safeTransferFrom(
      this.address,
      to,
      tokenId,
      amount,
      data
    );

    // Execute the transaction
    return await this.runner.sendTransaction!([transferTx]);
  }

  /**
   * Transfer ERC20 tokens using the standard transfer function
   * @private
   */
  private async _transferErc20(
    to: Address,
    amount: bigint,
    tokenAddress: Address
  ): Promise<TransactionReceipt> {
    // Encode the ERC20 transfer function call
    const data = encodeFunctionData({
      abi: [{
        type: 'function',
        name: 'transfer',
        inputs: [
          { name: 'to', type: 'address' },
          { name: 'value', type: 'uint256' }
        ],
        outputs: [{ name: '', type: 'bool' }],
        stateMutability: 'nonpayable',
      }],
      functionName: 'transfer',
      args: [to, amount],
    });

    // Create and send the transaction
    return await this.runner.sendTransaction!([{
      to: tokenAddress,
      data,
      value: 0n,
    }]);
  }
}

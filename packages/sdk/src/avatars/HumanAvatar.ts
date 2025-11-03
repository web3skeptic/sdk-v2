import type {
  Address,
  AdvancedTransferOptions,
  Profile,
  FindPathParams,
} from '@circles-sdk/types';
import type { TransactionReceipt } from 'viem';
import type { Core } from '@circles-sdk/core';
import type {
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  ContractRunner,
} from '../types';
import type { Observable, CirclesEvent } from '@circles-sdk/rpc';
import { Observable as ObservableClass } from '@circles-sdk/rpc';
import { cidV0ToHex, bytesToHex, ValidationError } from '@circles-sdk/utils';
import { SdkError } from '../errors';
import { Profiles } from '@circles-sdk/profiles';
import {
  CirclesType,
  DemurrageCirclesContract,
  InflationaryCirclesContract,
  BaseGroupContract
} from '@circles-sdk/core';
import { encodeAbiParameters, parseAbiParameters, encodeFunctionData } from 'viem';
import { TransferBuilder } from '@circles-sdk/transfers';
import { CirclesRpc, type AggregatedTrustRelation } from '@circles-sdk/rpc';

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
  public events: Observable<CirclesEvent>;
  private readonly runner: ContractRunner;
  private readonly profiles: Profiles;
  private readonly transferBuilder: TransferBuilder;
  private readonly rpc: CirclesRpc;
  private _cachedProfile?: Profile;
  private _cachedProfileCid?: string;
  private _eventSubscription?: () => void;

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
      throw SdkError.notInitialized('ContractRunner');
    }

    if (!contractRunner.sendTransaction) {
      throw SdkError.unsupportedOperation(
        'sendTransaction',
        'Contract runner does not support transaction sending'
      );
    }

    this.runner = contractRunner;

    // Initialize profiles client with the profile service URL from config
    this.profiles = new Profiles(core.config.profileServiceUrl);

    // Initialize RPC client
    this.rpc = new CirclesRpc(core.config.circlesRpcUrl);

    // Initialize transfer builder
    this.transferBuilder = new TransferBuilder(core);

    // Event subscription is optional - initialize with stub observable
    const stub = ObservableClass.create<CirclesEvent>();
    this.events = stub.property;
  }

  // Balance methods
  public readonly balances = {
    getTotal: async (): Promise<bigint> => {
      return await this.rpc.balance.getTotalBalance(this.address);
    },

    getTokenBalances: async (): Promise<TokenBalanceRow[]> => {
      return await this.rpc.balance.getTokenBalances(this.address) as unknown as TokenBalanceRow[];
    },

    getTotalSupply: async (): Promise<bigint> => {
      // TODO: Implement total supply fetching
      throw new Error('balances.getTotalSupply() not yet implemented');
    },

    /**
     * Get the maximum amount that can be replenished (converted to unwrapped personal CRC)
     * This calculates how much of your wrapped tokens and other tokens can be converted
     * into your own unwrapped ERC1155 personal CRC tokens using pathfinding
     *
     * @param options Optional pathfinding options
     * @returns Maximum replenishable amount in atto-circles
     *
     * @example
     * ```typescript
     * const maxReplenishable = await avatar.balances.getMaxReplenishable();
     * console.log('Can replenish:', CirclesConverter.attoCirclesToCircles(maxReplenishable), 'CRC');
     * ```
     */
    //@todo improve calculation
    getMaxReplenishable: async (options?: PathfindingOptions): Promise<bigint> => {
      const addr = this.address.toLowerCase() as Address;

      // Find maximum flow from avatar to itself, targeting personal tokens as destination
      // This effectively asks: "How much can I convert to my own personal tokens?"
      // @todo add sim trust
      const maxFlow = await this.rpc.pathfinder.findMaxFlow({
        from: addr,
        to: addr,
        toTokens: [addr], // Destination token is sender's own personal CRC
        useWrappedBalances: true, // Include wrapped tokens
        ...options,
      });

      return maxFlow;
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
     * const receipt = await avatar.balances.replenish();
     * console.log('Replenished personal tokens, tx hash:', receipt.hash);
     * ```
     */
    //@todo add amount to replenish
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
     * const receipt = await avatar.transfer.direct('0x123...', BigInt(100e18));
     *
     * // Send wrapped tokens
     * const receipt = await avatar.transfer.direct('0x123...', BigInt(100e18), '0xWrappedTokenAddress...');
     * ```
     */
    direct: async (
      to: Address,
      amount: bigint,
      tokenAddress?: Address,
      txData?: Uint8Array
    ): Promise<TransactionReceipt> => {
      // Default to sender's personal token if not specified
      // Validate inputs
      if (!to || to.length !== 42 || !to.startsWith('0x')) {
        throw ValidationError.invalidAddress(to);
      }

      if (amount <= 0n) {
        throw ValidationError.invalidAmount(amount, 'Amount must be positive');
      }

      const token = tokenAddress || this.address;

      // Validate token address if provided
      if (tokenAddress && (!tokenAddress || tokenAddress.length !== 42 || !tokenAddress.startsWith('0x'))) {
        throw ValidationError.invalidAddress(tokenAddress);
      }

      // Get token info to determine transfer type
      const tokenInfo = await this.rpc.token.getTokenInfo(token);

      if (!tokenInfo) {
        throw SdkError.configError(`Token not found: ${token}`, { token });
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
      // throw new Error('minor error');
      // Execute the constructed transactions
      return await this.runner.sendTransaction!(transactions);
    },

    getMaxAmount: async (to: Address): Promise<bigint> => {
      return await this.rpc.pathfinder.findMaxFlow({
        from: this.address.toLowerCase() as Address,
        to: to.toLowerCase() as Address
      });
    },

    getMaxAmountAdvanced: async (to: Address, options?: PathfindingOptions): Promise<bigint> => {
      return await this.rpc.pathfinder.findMaxFlow({
        from: this.address.toLowerCase() as Address,
        to: to.toLowerCase() as Address,
        ...options
      });
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
      // Prepare transaction(s)
      const avatars = Array.isArray(avatar) ? avatar : [avatar];

      if (avatars.length === 0) {
        throw ValidationError.missingParameter('avatar');
      }

      // Validate addresses
      for (const addr of avatars) {
        if (!addr || addr.length !== 42 || !addr.startsWith('0x')) {
          throw ValidationError.invalidAddress(addr);
        }
      }

      // Untrust by setting expiry to 0
      const untrustExpiry = BigInt(0);

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

    getAll: async (): Promise<AggregatedTrustRelation[]> => {
      return await this.rpc.trust.getAggregatedTrustRelations(this.address);
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
    // @todo check if it functionable
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
     *
     * This method calls the HubV2 contract's calculateIssuance function which returns:
     * - Total issuance amount: The total amount of tokens that can be minted
     * - Start period: The period when minting started
     * - End period: The current period
     *
     * @returns Object containing issuance amount (in atto-circles), start period, and end period
     *
     * @example
     * ```typescript
     * const { amount, startPeriod, endPeriod } = await avatar.personalToken.getMintableAmount();
     * console.log('Mintable amount:', CirclesConverter.attoCirclesToCircles(amount), 'CRC');
     * console.log('Start period:', startPeriod.toString());
     * console.log('End period:', endPeriod.toString());
     * ```
     */
    getMintableAmount: async (): Promise<{
      amount: bigint;
      startPeriod: bigint;
      endPeriod: bigint;
    }> => {
      const [amount, startPeriod, endPeriod] = await this.core.hubV2.calculateIssuance(this.address);

      return {
        amount,
        startPeriod,
        endPeriod,
      };
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
    mint: async (): Promise<TransactionReceipt> => {
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
    stop: async (): Promise<TransactionReceipt> => {
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
    updateMetadata: async (cid: string): Promise<TransactionReceipt> => {
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
    registerShortName: async (nonce: number): Promise<TransactionReceipt> => {
      const registerTx = this.core.nameRegistry.registerShortNameWithNonce(BigInt(nonce));
      return await this.runner.sendTransaction!([registerTx]);
    },
  };

  // History methods
  public readonly history = {
    /**
     * Get transaction history for this avatar
     * Returns incoming/outgoing transactions and minting events
     *
     * @param limit Maximum number of transactions to return (default: 50)
     * @returns Array of transaction history entries
     *
     * @example
     * ```typescript
     * const txHistory = await avatar.history.getTransactions(20);
     * txHistory.forEach(tx => {
     *   console.log(`${tx.from} -> ${tx.to}: ${tx.value}`);
     * });
     * ```
     */
    getTransactions: async (
      limit: number = 50
    ): Promise<TransactionHistoryRow[]> => {
      return await this.rpc.transaction.getTransactionHistory(this.address, limit);
    },
  };

  // Group token methods
  public readonly groupToken = {
    /**
     * Mint group tokens by transferring collateral to the group's mint handler
     * Uses pathfinding to transfer tokens along the trust network, including wrapped tokens
     *
     * @param group The group address to mint tokens from
     * @param amount Amount of tokens to transfer to the mint handler (in atto-circles)
     * @returns Transaction receipt
     *
     * @example
     * ```typescript
     * // Mint group tokens by sending 100 CRC to the group's mint handler
     * const receipt = await avatar.groupToken.mint('0xGroupAddress...', BigInt(100e18));
     * ```
     */
    mint: async (
      group: Address,
      amount: bigint
    ): Promise<TransactionReceipt> => {
      // Create BaseGroupContract instance to get mint handler
      const groupContract = new BaseGroupContract({
        address: group,
        rpcUrl: this.core.rpcUrl,
      });

      const mintHandler = await groupContract.BASE_MINT_HANDLER();

      // Use transferBuilder to construct transfer to mint handler with pathfinding
      // Include wrapped tokens in pathfinding
      const transactions = await this.transferBuilder.constructAdvancedTransfer(
        this.address,
        mintHandler,
        amount,
        { useWrappedBalances: true }
      );

      return await this.runner.sendTransaction!(transactions);
    },

    /**
     * Get the maximum amount that can be minted for a group
     * This calculates the maximum transferable amount to the group's mint handler
     * including wrapped token balances
     *
     * @param group The group address
     * @returns Maximum mintable amount in atto-circles
     *
     * @example
     * ```typescript
     * const maxMintable = await avatar.groupToken.getMaxMintableAmount('0xGroupAddress...');
     * console.log('Can mint up to:', maxMintable.toString(), 'atto-circles');
     * ```
     */
    getMaxMintableAmount: async (group: Address): Promise<bigint> => {
      // Create BaseGroupContract instance to get mint handler
      const groupContract = new BaseGroupContract({
        address: group,
        rpcUrl: this.core.rpcUrl,
      });

      const mintHandler = await groupContract.BASE_MINT_HANDLER();

      // Find max flow to mint handler including wrapped tokens
      return await this.rpc.pathfinder.findMaxFlow({
        from: this.address.toLowerCase() as Address,
        to: mintHandler.toLowerCase() as Address,
        useWrappedBalances: true,
      });
    },

    /**
     * Automatically redeem collateral tokens from a Base Group's treasury
     *
     * Performs automatic redemption by determining trusted collaterals and using pathfinder for optimal flow.
     * Only supports Base Group types. The function uses pathfinder to determine the optimal redemption path
     * and validates that sufficient liquidity exists before attempting redemption.
     *
     * @param group The address of the Base Group from which to redeem collateral tokens
     * @param amount The amount of group tokens to redeem for collateral (must be > 0 and <= max redeemable)
     * @returns A Promise resolving to the transaction receipt upon successful automatic redemption
     *
     * @example
     * ```typescript
     * // Redeem 100 group tokens for collateral
     * const receipt = await avatar.groupToken.redeem('0xGroupAddress...', BigInt(100e18));
     * ```
     */
    //@todo check
    redeem: async (
      group: Address,
      amount: bigint
    ): Promise<TransactionReceipt> => {
      group = group.toLowerCase() as Address;

      // Get group information to validate it's a Base Group
      // @todo replace with the request to the group contract
      const groupInfo = await this.rpc.token.getTokenInfo(group);
      if (!groupInfo) {
        throw SdkError.configError(`Group not found: ${group}`, { group });
      }

      // Validate it's a Base Group (supports CrcV2_RegisterGroup event type)
      // In V2, base groups are registered with CrcV2_RegisterGroup
      if (groupInfo.tokenType !== 'CrcV2_RegisterGroup') {
        throw SdkError.unsupportedOperation(
          'redeem',
          'Only Base Groups support this method'
        );
      }

      // Address of the redeemer
      const currentAvatar = this.address.toLowerCase() as Address;

      // Create BaseGroupContract instance to get treasury
      const groupContract = new BaseGroupContract({
        address: group,
        rpcUrl: this.core.rpcUrl,
      });

      const treasuryAddress = (await groupContract.BASE_TREASURY()).toLowerCase() as Address;

      // Get list of all tokens in the treasury
      const treasuryBalances = await this.rpc.balance.getTokenBalances(treasuryAddress);
      const treasuryTokens = treasuryBalances
        .filter((balance: any) => balance.isErc1155)
        .map((balance: any) => balance.tokenAddress.toLowerCase() as Address);

      // Get trust relationships to determine expected collateral tokens
      const trustRelationships = await this.rpc.trust.getAggregatedTrustRelations(currentAvatar);

      // Filter for tokens that:
      // 1. Are mutually trusted or trusted by current avatar
      // 2. Exist in the treasury
      const expectedToTokens = trustRelationships
        .filter((trustObject) => {
          if (
            (trustObject.relation === 'mutuallyTrusts' || trustObject.relation === 'trusts') &&
            treasuryTokens.includes(trustObject.objectAvatar.toLowerCase() as Address)
          ) {
            return true;
          }
          return false;
        })
        .map((trustObject) => trustObject.objectAvatar.toLowerCase() as Address);

      // Check if enough tokens as amount - validate max redeemable
      const maxRedeemableAmount = await this.rpc.pathfinder.findMaxFlow({
        from: currentAvatar,
        to: currentAvatar,
        useWrappedBalances: false,
        fromTokens: [group],
        toTokens: expectedToTokens,
      });

      if (BigInt(maxRedeemableAmount) < amount) {
        throw ValidationError.invalidAmount(
          amount,
          `Specified amount ${amount} exceeds max tokens flow ${maxRedeemableAmount}`
        );
      }

      // Construct the redemption transfer using TransferBuilder
      const transactions = await this.transferBuilder.constructAdvancedTransfer(
        currentAvatar,
        currentAvatar, // Redeem to self
        amount,
        {
          useWrappedBalances: false,
          fromTokens: [group], // Redeem from group tokens
          toTokens: expectedToTokens, // Receive trusted collateral tokens
        }
      );

      if (!transactions || transactions.length === 0) {
        throw SdkError.operationFailed('groupToken.redeem', 'No transactions generated');
      }

      return await this.runner.sendTransaction!(transactions);
    },

    properties: {
      /**
       * Get the owner of a specific group
       * @param group The group address
       * @returns The owner address of the group
       */
      owner: async (group: Address): Promise<Address> => {
        const groupContract = new BaseGroupContract({
          address: group,
          rpcUrl: this.core.rpcUrl,
        });
        return await groupContract.owner();
      },

      /**
       * Get the mint handler address of a specific group
       * @param group The group address
       * @returns The mint handler address
       */
      mintHandler: async (group: Address): Promise<Address> => {
        const groupContract = new BaseGroupContract({
          address: group,
          rpcUrl: this.core.rpcUrl,
        });
        return await groupContract.BASE_MINT_HANDLER();
      },

      /**
       * Get the treasury (redemption handler) address of a specific group
       * @param group The group address
       * @returns The treasury address where redemptions are handled
       */
      treasury: async (group: Address): Promise<Address> => {
        const groupContract = new BaseGroupContract({
          address: group,
          rpcUrl: this.core.rpcUrl,
        });
        return await groupContract.BASE_TREASURY();
      },

      /**
       * Get the service address of a specific group
       * @param group The group address
       * @returns The service address
       */
      service: async (group: Address): Promise<Address> => {
        const groupContract = new BaseGroupContract({
          address: group,
          rpcUrl: this.core.rpcUrl,
        });
        return await groupContract.service();
      },

      /**
       * Get the fee collection address of a specific group
       * @param group The group address
       * @returns The fee collection address
       */
      feeCollection: async (group: Address): Promise<Address> => {
        const groupContract = new BaseGroupContract({
          address: group,
          rpcUrl: this.core.rpcUrl,
        });
        return await groupContract.feeCollection();
      },

      /**
       * Get all membership conditions for a specific group
       * @param group The group address
       * @returns Array of membership condition addresses
       */
      getMembershipConditions: async (group: Address): Promise<Address[]> => {
        const groupContract = new BaseGroupContract({
          address: group,
          rpcUrl: this.core.rpcUrl,
        });
        const conditions = await groupContract.getMembershipConditions();
        return Array.from(conditions);
      },
    },

  };

  // Group methods (alias for groupToken)
  public readonly group = {
    properties: this.groupToken.properties
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
    ): Promise<TransactionReceipt> => {
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
    ): Promise<TransactionReceipt> => {
      const inflationaryContract = new InflationaryCirclesContract({
        address: tokenAddress,
        rpcUrl: this.core.rpcUrl
      });
      const unwrapTx = inflationaryContract.unwrap(amount);
      return await this.runner.sendTransaction!([unwrapTx]);
    },
  };

  // ============================================================================
  // Event Subscription Methods
  // ============================================================================

  /**
   * Subscribe to Circles events for this avatar
   * Events are filtered to only include events related to this avatar's address
   *
   * @returns Promise that resolves when subscription is established
   *
   * @example
   * ```typescript
   * await avatar.subscribeToEvents();
   *
   * // Listen for events
   * avatar.events.subscribe((event) => {
   *   console.log('Event received:', event.$event, event);
   *
   *   if (event.$event === 'CrcV2_PersonalMint') {
   *     console.log('Minted:', event.amount);
   *   }
   * });
   * ```
   */
  async subscribeToEvents(): Promise<void> {
    // Subscribe to events via RPC WebSocket
    const observable = await this.rpc.client.subscribe(this.address);
    this.events = observable;
  }

  /**
   * Unsubscribe from events
   * Cleans up the WebSocket connection and event listeners
   */
  unsubscribeFromEvents(): void {
    if (this._eventSubscription) {
      this._eventSubscription();
      this._eventSubscription = undefined;
    }
  }

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

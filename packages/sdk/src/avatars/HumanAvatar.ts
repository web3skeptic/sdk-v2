import type {
  Address,
  AvatarRow,
  TokenBalanceRow,
} from '@circles-sdk-v2/types';
import type { TransactionReceipt } from 'viem';
import type { Core } from '@circles-sdk-v2/core';
import type { ContractRunner } from '@circles-sdk-v2/runner';
import { ValidationError } from '@circles-sdk-v2/utils';
import { SdkError } from '../errors';
import { BaseGroupContract } from '@circles-sdk-v2/core';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { CommonAvatar, type PathfindingOptions } from './CommonAvatar';

/**
 * HumanAvatar class implementation
 * Provides a simplified, user-friendly wrapper around Circles protocol for human avatars
 *
 * This class represents a human avatar in the Circles ecosystem and provides
 * methods for managing trust relationships, personal token minting, transfers, and more.
 */
export class HumanAvatar extends CommonAvatar {
  constructor(
    address: Address,
    core: Core,
    contractRunner?: ContractRunner,
    avatarInfo?: AvatarRow
  ) {
    super(address, core, contractRunner, avatarInfo);
  }

  // ============================================================================
  // Override Balance Methods with Human-Specific Features
  // ============================================================================

  public readonly balances = {
    getTotal: async (): Promise<bigint> => {
      return await this.rpc.balance.getTotalBalance(this.address);
    },

    getTokenBalances: async (): Promise<TokenBalanceRow[]> => {
      return await this.rpc.balance.getTokenBalances(this.address) as unknown as TokenBalanceRow[];
    },

    getTotalSupply: async (): Promise<bigint> => {
      throw SdkError.unsupportedOperation('getTotalSupply', 'This method is not yet implemented');
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
        throw SdkError.configError(
          'No tokens available to replenish',
          { message: 'You may not have any wrapped tokens or convertible tokens' }
        );
      }

      // Execute the constructed transactions
      return await this.runner.sendTransaction!(transactions);
    },
  };

  // ============================================================================
  // Transfer methods are inherited from CommonAvatar
  // ============================================================================

  // ============================================================================
  // Trust methods are inherited from CommonAvatar
  // ============================================================================

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

  // ============================================================================
  // Profile methods are inherited from CommonAvatar
  // ============================================================================

  // ============================================================================
  // History methods are inherited from CommonAvatar
  // ============================================================================

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

  // ============================================================================
  // Wrap methods are inherited from CommonAvatar
  // ============================================================================

  // ============================================================================
  // Event Subscription Methods are inherited from CommonAvatar
  // ============================================================================

  // ============================================================================
  // Helper Methods are inherited from CommonAvatar
  // ============================================================================
}

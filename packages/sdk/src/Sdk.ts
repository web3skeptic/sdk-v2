import type {
  Address,
  CirclesConfig,
  Profile,
  GroupProfile
} from '@circles-sdk/types';
import { circlesConfig, Core, CirclesType } from '@circles-sdk/core';
import { CirclesRpc } from '@circles-sdk/rpc';
import { Profiles } from '@circles-sdk/profiles';
import { cidV0ToHex } from '@circles-sdk/utils';
import { HumanAvatar } from './HumanAvatar';
import { BaseGroupAvatar } from './BaseGroupAvatar';
import type {
  ContractRunner,
  CirclesData,
  HubV2,
  V2Pathfinder,
  GroupType,
} from './types';


/**
 * Simplified Circles SDK
 * Provides a user-friendly API for non-crypto users with low entrance barrier
 *
 * @example
 * ```typescript
 * const sdk = new Sdk();
 *
 * // Register as a human
 * const avatar = await sdk.register.asHuman('0xInviterAddress', {
 *   name: 'Alice',
 *   description: 'Developer'
 * });
 *
 * // Get an avatar
 * const avatar = await sdk.getAvatar('0xAvatarAddress');
 *
 * // Transfer tokens
 * await avatar.transfer.send('0xRecipient', 100);
 *
 * // Mint personal tokens
 * await avatar.personalToken.mint();
 * ```
 */
export class Sdk {
  public readonly circlesConfig: CirclesConfig;
  public readonly contractRunner?: ContractRunner;
  public readonly senderAddress?: Address;
  public readonly core: Core;
  private readonly rpc: CirclesRpc;
  private readonly profilesClient: Profiles;

  public readonly data: CirclesData = {
    getAvatar: async (address: Address) => {
      throw new Error('data.getAvatar() not yet implemented');
    },
    getTrustRelations: async (address: Address) => {
      throw new Error('data.getTrustRelations() not yet implemented');
    },
    getBalances: async (address: Address) => {
      throw new Error('data.getBalances() not yet implemented');
    },
  };

  public readonly v2Hub: HubV2 = {
    registerHuman: async (inviter: Address) => {
      throw new Error('v2Hub.registerHuman() not yet implemented');
    },
    registerOrganization: async () => {
      throw new Error('v2Hub.registerOrganization() not yet implemented');
    },
    registerGroup: async (mint: Address, name: string, symbol: string) => {
      throw new Error('v2Hub.registerGroup() not yet implemented');
    },
    trust: async (trustee: Address, expiry: bigint) => {
      throw new Error('v2Hub.trust() not yet implemented');
    },
    personalMint: async () => {
      throw new Error('v2Hub.personalMint() not yet implemented');
    },
    groupMint: async (group: Address, collateral: Address[], amounts: bigint[], data: Uint8Array) => {
      throw new Error('v2Hub.groupMint() not yet implemented');
    },
  };

  public readonly v2Pathfinder: V2Pathfinder = {
    computeTransfer: async (from: Address, to: Address, value: bigint) => {
      throw new Error('v2Pathfinder.computeTransfer() not yet implemented');
    },
    findPath: async (from: Address, to: Address, value: bigint) => {
      throw new Error('v2Pathfinder.findPath() not yet implemented');
    },
  };

  /**
   * Create a new Sdk instance
   *
   * @param config Circles configuration (defaults to Gnosis Chain mainnet)
   * @param contractRunner Optional contract runner for executing transactions
   * @throws Error if contractRunner is provided but doesn't support sendTransaction or has no address
   */
  constructor(config: CirclesConfig = circlesConfig[100], contractRunner?: ContractRunner) {
    this.circlesConfig = config;
    this.contractRunner = contractRunner;
    this.core = new Core(config);
    this.rpc = new CirclesRpc(config.circlesRpcUrl);
    this.profilesClient = new Profiles(config.profileServiceUrl);

    // Validate and extract sender address from contract runner
    if (contractRunner) {
      if (!contractRunner.sendTransaction) {
        throw new Error('Contract runner must support sendTransaction method');
      }

      const address = (contractRunner as any).address;
      if (!address) {
        throw new Error('Cannot determine sender address from contract runner');
      }

      this.senderAddress = address as Address;
    }
  }

  /**
   * Get an avatar by address
   * Automatically detects the avatar type and returns the appropriate avatar instance
   * @returns HumanAvatar for human/organization avatars, BaseGroupAvatar for group avatars
   */
  async getAvatar(avatarAddress: Address): Promise<HumanAvatar | BaseGroupAvatar> {
    try {
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(avatarAddress);

      // Detect avatar type and return appropriate avatar class
      const avatarType = (avatarInfo as any)?.type;

      if (avatarType === 'CrcV2_RegisterGroup') {
        return new BaseGroupAvatar(avatarAddress, this.core, this.contractRunner, avatarInfo as any);
      }

      // Default to HumanAvatar for human/organization types
      return new HumanAvatar(avatarAddress, this.core, this.contractRunner, avatarInfo as any);
    } catch (error) {
      // Return HumanAvatar without info if fetch fails
      return new HumanAvatar(avatarAddress, this.core, this.contractRunner);
    }
  }

  /**
   * Registration methods for creating new Circles identities
   */
  public readonly register = {
    /**
     * Register as a human in the Circles ecosystem
     *
     * This function:
     * 1. Checks for pending invitations from inviters in the InvitationEscrow
     * 2. If invitations exist, redeems one to claim escrowed tokens
     * 3. Otherwise, checks if the specified inviter has enough unwrapped CRC
     * 4. Creates and uploads profile data to IPFS
     * 5. Registers the human with the profile CID
     * 6. Returns a HumanAvatar instance for the registered account
     *
     * Requirements:
     * - Contract runner must be configured to execute transactions
     * - Either: pending invitations from inviters, OR inviter has 96+ CRC unwrapped
     *
     * @param inviter Address of the inviting avatar (fallback if no invitations found)
     * @param profile Profile data with name, description, etc.
     * @returns HumanAvatar instance for the newly registered human
     *
     * @example
     * ```typescript
     * const avatar = await sdk.register.asHuman('0xInviter', {
     *   name: 'Alice',
     *   description: 'Developer'
     * });
     * ```
     */
    asHuman: async (
      inviter: Address,
      profile: Profile | string
    ): Promise<HumanAvatar> => {
      if (
        !this.contractRunner ||
        !this.contractRunner.sendTransaction ||
        !this.senderAddress
      ) {
        throw new Error('Sdk requires a contract runner with a sender address. Initialize with a ContractRunner.');
      }

      // List of transactions to execute
      const transactions: any[] = [];

      // Step 1: Check for pending invitations in the InvitationEscrow
      const inviters = await this.core.invitationEscrow.getInviters(this.senderAddress);

      if (inviters.length > 0) {
        // Redeem the invitation from the first available inviter
        const redeemTx = this.core.invitationEscrow.redeemInvitation(inviters[0]);
        transactions.push(redeemTx);
      } else {
        // No invitations found, check if inviter has enough unwrapped CRC
        // Minimum required: 96 CRC (after demurrage it becomes valid amount)
        const minRequiredCRC = BigInt(96e18); // 96 CRC in atto-circles

        // Get the token ID for the inviter's personal token
        const tokenId = await this.core.hubV2.toTokenId(inviter);

        // Check balance at the Inviter address
        const balance = await this.core.hubV2.balanceOf(inviter, tokenId);

        if (balance < minRequiredCRC) {
          throw new Error(
            `Insufficient unwrapped CRC balance. Inviter needs 96+ CRC. ` +
            `Current balance: ${Number(balance) / 1e18} CRC`
          );
        }
      }

      // Step 2: Create and upload profile to IPFS
      let profileCid: string;

      if (typeof profile === 'string') {
        // Profile is already a CID
        profileCid = profile;
      } else {
        // Create profile and upload to IPFS
        profileCid = await this.profilesClient.create(profile);
      }

      // Convert CID to metadata digest hex (format expected by registerHuman)
      const metadataDigest = cidV0ToHex(profileCid);

      // Step 3: Call registerHuman with profile data
      const registerTx = this.core.hubV2.registerHuman(inviter, metadataDigest as `0x${string}`);
      transactions.push(registerTx);

      // Step 4: Execute all transactions
      await this.contractRunner!.sendTransaction(transactions);

      // Step 5: Return a HumanAvatar instance for the newly registered account
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(this.senderAddress);
      return new HumanAvatar(
        this.senderAddress,
        this.core,
        this.contractRunner,
        avatarInfo as any // @todo remove any
      );
    },

    /**
     * Register as an organization
     * @param profile Profile data for the organization
     * @returns HumanAvatar instance for the newly registered organization
     */
    asOrganization: async (profile: Profile): Promise<HumanAvatar> => {
      // TODO: Implement organization registration
      throw new Error('register.asOrganization() not yet implemented');
    },

    /**
     * Register as a group
     * @param mint Address of the mint policy
     * @param profile Group profile data (includes symbol)
     * @returns HumanAvatar instance for the newly registered group
     */
    asGroup: async (mint: Address, profile: GroupProfile): Promise<HumanAvatar> => {
      // TODO: Implement group registration
      throw new Error('register.asGroup() not yet implemented');
    },
  };

  /**
   * Profile management methods
   */
  public readonly profiles = {
    /**
     * Create and pin a profile to IPFS
     * @param profile Profile data or CID string
     * @returns CID of the pinned profile
     */
    create: async (profile: Profile): Promise<string> => {
      return await this.profilesClient.create(profile);
    },

    /**
     * Get a profile by CID
     * @param cid Content identifier
     * @returns Profile data or undefined if not found
     */
    get: async (cid: string): Promise<Profile | undefined> => {
      return await this.profilesClient.get(cid);
    },
  };

  /**
   * Token utilities
   */
  public readonly tokens = {
    /**
     * Get an inflationary wrapper for a token
     * @param address Avatar address
     * @returns The ERC20 inflationary wrapper address, or zero address if not deployed
     */
    getInflationaryWrapper: async (address: Address): Promise<Address> => {
      return await this.core.liftERC20.erc20Circles(CirclesType.Inflation, address);
    },

    /**
     * Get a demurraged wrapper for a token
     * @param address Avatar address
     * @returns The ERC20 demurraged wrapper address, or zero address if not deployed
     */
    getDemurragedWrapper: async (address: Address): Promise<Address> => {
      return await this.core.liftERC20.erc20Circles(CirclesType.Demurrage, address);
    },
  };

  /**
   * Group utilities
   */
  public readonly groups = {
    /**
     * Get the type of a group
     * @param avatar Group avatar address
     * @returns Group type or undefined if not a group
     */
    getType: async (avatar: Address): Promise<GroupType | undefined> => {
      // TODO: Implement group type detection
      throw new Error('groups.getType() not yet implemented');
    },
  };
}

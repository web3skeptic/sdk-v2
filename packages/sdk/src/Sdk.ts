import type { Address, CirclesConfig, Profile, GroupProfile } from '@circles-sdk/types';
import { circlesConfig, Core } from '@circles-sdk/core';
import { CirclesRpc } from '@circles-sdk/rpc';
import { Profiles } from '@circles-sdk/profiles';
import { HumanAvatar } from './HumanAvatar';
import type {
  SdkInterface,
  ContractRunner,
  CirclesData,
  HubV2,
  V2Pathfinder,
  GroupType,
} from './types';

// Type alias for transaction responses
export type ContractTransactionReceipt = import('@circles-sdk/types').TransactionResponse;

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
export class Sdk implements SdkInterface {
  public readonly circlesConfig: CirclesConfig;
  public readonly contractRunner?: ContractRunner;
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
   */
  constructor(config: CirclesConfig = circlesConfig[100], contractRunner?: ContractRunner) {
    this.circlesConfig = config;
    this.contractRunner = contractRunner;
    this.core = new Core(config);
    this.rpc = new CirclesRpc(config.circlesRpcUrl);
    this.profilesClient = new Profiles(config.profileServiceUrl);
  }

  /**
   * Get an avatar by address
   * Returns a HumanAvatar instance that provides methods for interacting with the avatar
   */
  async getAvatar(avatarAddress: Address): Promise<HumanAvatar> {
    // TODO: Implement avatar fetching with RPC
    // For now, return a basic HumanAvatar instance
    try {
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(avatarAddress);
      return new HumanAvatar(avatarAddress, this.core, this.contractRunner, avatarInfo as any);
    } catch (error) {
      // Return avatar without info if fetch fails
      return new HumanAvatar(avatarAddress, this.core, this.contractRunner);
    }
  }

  /**
   * Registration methods for creating new Circles identities
   */
  public readonly register = {
    /**
     * Register as a human (requires invitation)
     * @param inviter Address of the inviting avatar
     * @param profile Profile data (can be a Profile object or CID string)
     * @returns HumanAvatar instance for the newly registered human
     */
    asHuman: async (
      inviter: Address,
      profile: Profile | string
    ): Promise<HumanAvatar> => {
      // TODO: Implement human registration
      throw new Error('register.asHuman() not yet implemented');
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
     * Create or update a profile
     * @param profile Profile data or CID string
     * @returns Transaction receipt
     */
    createOrUpdate: async (
      profile: Profile | string
    ): Promise<ContractTransactionReceipt> => {
      // TODO: Implement profile creation/update
      throw new Error('profiles.createOrUpdate() not yet implemented');
    },

    /**
     * Get a profile by CID
     * @param cid Content identifier
     * @returns Profile data or undefined if not found
     */
    get: async (cid: string): Promise<Profile | undefined> => {
      return this.profilesClient.get(cid);
    },
  };

  /**
   * Token utilities
   */
  public readonly tokens = {
    /**
     * Get an inflationary wrapper for a token
     * @param address Token address
     */
    getInflationaryWrapper: async (address: Address): Promise<any> => {
      // TODO: Implement inflationary wrapper
      throw new Error('tokens.getInflationaryWrapper() not yet implemented');
    },

    /**
     * Get a demurraged wrapper for a token
     * @param address Token address
     */
    getDemurragedWrapper: async (address: Address): Promise<any> => {
      // TODO: Implement demurraged wrapper
      throw new Error('tokens.getDemurragedWrapper() not yet implemented');
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

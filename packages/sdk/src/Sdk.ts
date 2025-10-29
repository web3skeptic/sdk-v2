import type {
  Address,
  CirclesConfig,
  Profile,
  AvatarInfo,
  TokenBalance
} from '@circles-sdk/types';
import { circlesConfig, Core, CirclesType } from '@circles-sdk/core';
import { CirclesRpc, type AggregatedTrustRelation } from '@circles-sdk/rpc';
import { Profiles } from '@circles-sdk/profiles';
import { cidV0ToHex } from '@circles-sdk/utils';
import { HumanAvatar, OrganisationAvatar, BaseGroupAvatar } from './avatars';
import { SdkError } from './errors';
import { decodeEventLog } from 'viem';
import { baseGroupFactoryAbi } from '@circles-sdk/abis';
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
// @todo build common avatar inst
export class Sdk {
  public readonly circlesConfig: CirclesConfig;
  public readonly contractRunner?: ContractRunner;
  public readonly senderAddress?: Address;
  public readonly core: Core;
  private readonly rpc: CirclesRpc;
  private readonly profilesClient: Profiles;

  public readonly data: CirclesData = {
    getAvatar: async (address: Address): Promise<AvatarInfo | undefined> => {
      return await this.rpc.avatar.getAvatarInfo(address);
    },
    getTrustRelations: async (address: Address): Promise<AggregatedTrustRelation[]> => {
      return await this.rpc.trust.getAggregatedTrustRelations(address);
    },
    getBalances: async (address: Address): Promise<TokenBalance[]> => {
      return await this.rpc.balance.getTokenBalances(address);
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
        throw SdkError.configError('Contract runner must support sendTransaction method');
      }

      const address = (contractRunner as any).address;
      if (!address) {
        throw SdkError.configError('Cannot determine sender address from contract runner');
      }

      this.senderAddress = address as Address;
    }
  }

  /**
   * Get an avatar by address
   * Automatically detects the avatar type and returns the appropriate avatar instance
   * @returns HumanAvatar, OrganisationAvatar, or BaseGroupAvatar depending on type
   */
  async getAvatar(avatarAddress: Address): Promise<HumanAvatar | OrganisationAvatar | BaseGroupAvatar> {
    try {
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(avatarAddress);

      // Detect avatar type and return appropriate avatar class
      const avatarType = (avatarInfo as any)?.type;

      if (avatarType === 'CrcV2_RegisterGroup') {
        return new BaseGroupAvatar(avatarAddress, this.core, this.contractRunner, avatarInfo as any);
      }

      if (avatarType === 'CrcV2_RegisterOrganization') {
        return new OrganisationAvatar(avatarAddress, this.core, this.contractRunner, avatarInfo as any);
      }

      // Default to HumanAvatar for human type
      return new HumanAvatar(avatarAddress, this.core, this.contractRunner, avatarInfo as any);
    } catch (error) {
      throw SdkError.avatarNotFound(avatarAddress);
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
      if (!this.contractRunner || !this.senderAddress) {
        throw SdkError.missingContractRunner('Human registration');
      }

      const contractRunner: ContractRunner = this.contractRunner;
      const senderAddress: Address = this.senderAddress;

      // List of transactions to execute
      const transactions: any[] = [];

      // Step 1: Check for pending invitations in the InvitationEscrow
      const inviters = await this.core.invitationEscrow.getInviters(senderAddress);

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
          throw SdkError.insufficientBalance(
            '96 CRC',
            `${Number(balance) / 1e18} CRC`,
            'unwrapped CRC'
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
      await contractRunner.sendTransaction!(transactions);

      // Step 5: Return a HumanAvatar instance for the newly registered account
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(senderAddress);
      return new HumanAvatar(
        senderAddress,
        this.core,
        contractRunner,
        avatarInfo as any // @todo remove any
      );
    },

    /**
     * Register as an organization
     * Organizations can participate in Circles without minting personal tokens
     * and do not require invitations to register
     *
     * @param profile Profile data for the organization or CID string
     * @returns OrganisationAvatar instance for the newly registered organization
     *
     * @example
     * ```typescript
     * const orgAvatar = await sdk.register.asOrganization({
     *   name: 'My Organization',
     *   description: 'A Circles organization'
     * });
     * ```
     */
    asOrganization: async (profile: Profile | string): Promise<OrganisationAvatar> => {
      if (!this.contractRunner || !this.senderAddress) {
        throw SdkError.missingContractRunner('Organization registration');
      }

      const contractRunner: ContractRunner = this.contractRunner;
      const senderAddress: Address = this.senderAddress;

      // Step 1: Create and upload profile to IPFS, and extract name
      let profileCid: string;
      let profileData: Profile;

      if (typeof profile === 'string') {
        // Profile is already a CID - fetch it to get the name
        profileCid = profile;
        const fetchedProfile = await this.profilesClient.get(profileCid);
        if (!fetchedProfile) {
          throw SdkError.profileOperationFailed('fetch', `Profile not found with CID: ${profileCid}`);
        }
        profileData = fetchedProfile;
      } else {
        // Create profile and upload to IPFS
        profileData = profile;
        profileCid = await this.profilesClient.create(profile);
      }

      // Validate that profile has a name
      if (!profileData.name) {
        throw SdkError.invalidProfile('Profile must have a name field for organization registration');
      }

      // Convert CID to metadata digest hex (format expected by registerOrganization)
      const metadataDigest = cidV0ToHex(profileCid);

      // Step 2: Call registerOrganization with name and profile data
      const registerTx = this.core.hubV2.registerOrganization(
        profileData.name,
        metadataDigest as `0x${string}`
      );

      // Step 3: Execute the transaction
      await contractRunner.sendTransaction!([registerTx]);

      // Step 4: Return an OrganisationAvatar instance for the newly registered account
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(senderAddress);
      return new OrganisationAvatar(
        senderAddress,
        this.core,
        contractRunner,
        avatarInfo as any // @todo remove any
      );
    },

    /**
     * Register a base group
     * Creates a new base group using the BaseGroupFactory and registers it in the Circles ecosystem
     *
     * @param owner The address that will own the newly created BaseGroup
     * @param service The address of the service for the new BaseGroup
     * @param feeCollection The address of the fee collection for the new BaseGroup
     * @param initialConditions An array of initial condition addresses
     * @param name The group name (must be 19 characters or fewer)
     * @param symbol The group symbol (e.g., 'MYG')
     * @param profile Profile data (name, description, images, etc.) or CID string
     * @returns BaseGroupAvatar instance for the newly registered group
     *
     * @example
     * ```typescript
     * const groupAvatar = await sdk.register.asGroup(
     *   '0xOwnerAddress',
     *   '0xServiceAddress',
     *   '0xFeeCollectionAddress',
     *   [], // initial conditions
     *   'My Group', // name
     *   'MYG', // symbol
     *   {
     *     name: 'My Group',
     *     description: 'A Circles base group'
     *   }
     * );
     * ```
     */
    asGroup: async (
      owner: Address,
      service: Address,
      feeCollection: Address,
      initialConditions: Address[],
      name: string,
      symbol: string,
      profile: Profile | string
    ): Promise<BaseGroupAvatar> => {
      if (!this.contractRunner || !this.senderAddress) {
        throw SdkError.missingContractRunner('Group registration');
      }

      const contractRunner: ContractRunner = this.contractRunner;
      const senderAddress: Address = this.senderAddress;

      // Validate name and symbol
      if (!name) {
        throw SdkError.invalidProfile('Name is required for group registration');
      }
      if (!symbol) {
        throw SdkError.invalidProfile('Symbol is required for group registration');
      }

      // Validate name length (must be 19 characters or fewer)
      if (name.length > 19) {
        throw SdkError.invalidProfile('Group name must be 19 characters or fewer', {
          name,
          length: name.length
        });
      }

      // Step 1: Create and upload profile to IPFS
      let profileCid: string;

      if (typeof profile === 'string') {
        // Profile is already a CID
        profileCid = profile;
      } else {
        // Create profile and upload to IPFS
        profileCid = await this.profilesClient.create(profile);
      }

      // Convert CID to metadata digest hex (format expected by createBaseGroup)
      const metadataDigest = cidV0ToHex(profileCid);

      // Step 2: Create the base group using the factory
      const createGroupTx = this.core.baseGroupFactory.createBaseGroup(
        owner,
        service,
        feeCollection,
        initialConditions,
        name,
        symbol,
        metadataDigest as `0x${string}`
      );

      // Step 3: Execute the transaction
      const receipt = await contractRunner.sendTransaction!([createGroupTx]);

      // Step 4: Decode the BaseGroupCreated event to extract the group address
      let groupAddress: Address | undefined;

      for (const log of receipt.logs) {
        try {
          const decoded = decodeEventLog({
            abi: baseGroupFactoryAbi,
            data: log.data,
            topics: log.topics,
          });

          if (decoded.eventName === 'BaseGroupCreated') {
            groupAddress = (decoded.args as any).group;
            break;
          }
        } catch {
          // Not the event we're looking for, continue
          continue;
        }
      }

      if (!groupAddress) {
        throw SdkError.transactionDataExtractionFailed('group address', 'BaseGroupCreated event not found in transaction receipt');
      }

      // Step 5: Return a BaseGroupAvatar instance for the newly created group
      const avatarInfo = await this.rpc.avatar.getAvatarInfo(groupAddress);
      return new BaseGroupAvatar(
        groupAddress,
        this.core,
        contractRunner,
        avatarInfo as any // @todo remove any
      );
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
      throw SdkError.unsupportedOperation('groups.getType', 'not yet implemented');
    },
  };
}

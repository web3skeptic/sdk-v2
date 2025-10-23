import type {
  Address,
  Profile,
} from '@circles-sdk/types';
import type { TransactionReceipt } from 'viem';
import type { Core } from '@circles-sdk/core';
import type {
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  CirclesQuery,
  ContractRunner,
} from './types';
import type { Observable, CirclesEvent } from '@circles-sdk/events';
import { Observable as ObservableClass } from '@circles-sdk/events';
import { cidV0ToHex } from '@circles-sdk/utils';
import { Profiles } from '@circles-sdk/profiles';
import { BaseGroupContract } from '@circles-sdk/core';
import { CirclesRpc } from '@circles-sdk/rpc';

/**
 * BaseGroupAvatar class implementation
 * Provides a simplified wrapper around Circles protocol for base group avatars
 *
 * This class represents a base group avatar in the Circles ecosystem and provides
 * methods for managing trust relationships, group properties, and metadata.
 */
export class BaseGroupAvatar {
  public readonly address: Address;
  public readonly avatarInfo: AvatarRow | undefined;
  public readonly core: Core;
  public readonly contractRunner?: ContractRunner;
  public readonly events: Observable<CirclesEvent>;
  private readonly runner: ContractRunner;
  private readonly profiles: Profiles;
  private readonly rpc: CirclesRpc;
  private readonly baseGroup: BaseGroupContract;
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

    // Initialize profiles client
    this.profiles = new Profiles(core.config.profileServiceUrl);

    // Initialize RPC client
    this.rpc = new CirclesRpc(core.config.circlesRpcUrl);

    // Initialize BaseGroup contract
    this.baseGroup = new BaseGroupContract({
      address: this.address,
      rpcUrl: core.rpcUrl,
    });

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
      const tokenId = await this.core.hubV2.toTokenId(this.address);
      return await this.core.hubV2.totalSupply(tokenId);
    },
  };

  // Trust methods
  public readonly trust = {
    /**
     * Trust another avatar or multiple avatars
     *
     * @param avatar Single avatar address or array of avatar addresses
     * @param expiry Trust expiry timestamp. Defaults to max safe integer
     * @returns Transaction response
     */
    add: async (
      avatar: Address | Address[],
      expiry?: bigint
    ): Promise<TransactionReceipt> => {
      const trustExpiry = expiry ?? BigInt(Number.MAX_SAFE_INTEGER);
      const avatars = Array.isArray(avatar) ? avatar : [avatar];

      if (avatars.length === 0) {
        throw new Error('No avatars provided to trust');
      }

      // Create trust transactions for all avatars
      const transactions = avatars.map((trustee) =>
        this.baseGroup.trust(trustee, trustExpiry)
      );

      return await this.runner.sendTransaction!(transactions);
    },

    /**
     * Trust a batch of members with membership condition checks
     *
     * @param members Array of member addresses
     * @param expiry Trust expiry timestamp. Defaults to 0
     * @returns Transaction response
     */
    addBatchWithConditions: async (
      members: Address[],
      expiry?: bigint
    ): Promise<TransactionReceipt> => {
      const trustExpiry = expiry ?? BigInt(0);
      const tx = this.baseGroup.trustBatchWithConditions(members, trustExpiry);
      return await this.runner.sendTransaction!([tx]);
    },

    /**
     * Remove trust from another avatar or multiple avatars
     *
     * @param avatar Single avatar address or array of avatar addresses
     * @returns Transaction response
     */
    remove: async (avatar: Address | Address[]): Promise<TransactionReceipt> => {
      const untrustExpiry = BigInt(0);
      const avatars = Array.isArray(avatar) ? avatar : [avatar];

      if (avatars.length === 0) {
        throw new Error('No avatars provided to untrust');
      }

      // Create untrust transactions for all avatars
      const transactions = avatars.map((trustee) =>
        this.baseGroup.trust(trustee, untrustExpiry)
      );

      return await this.runner.sendTransaction!(transactions);
    },

    /**
     * Check if this avatar trusts another avatar
     */
    isTrusting: async (otherAvatar: Address): Promise<boolean> => {
      return await this.core.hubV2.isTrusted(this.address, otherAvatar);
    },

    /**
     * Check if another avatar trusts this avatar
     */
    isTrustedBy: async (otherAvatar: Address): Promise<boolean> => {
      return await this.core.hubV2.isTrusted(otherAvatar, this.address);
    },

    getAll: async (): Promise<TrustRelationRow[]> => {
      // TODO: Implement trust relations fetching
      throw new Error('trust.getAll() not yet implemented');
    },
  };

  // Group property methods
  public readonly properties = {
    owner: async (): Promise<Address> => {
      return await this.baseGroup.owner();
    },

    mintHandler: async (): Promise<Address> => {
      return await this.baseGroup.BASE_MINT_HANDLER();
    },

    service: async (): Promise<Address> => {
      return await this.baseGroup.service();
    },

    feeCollection: async (): Promise<Address> => {
      return await this.baseGroup.feeCollection();
    },

    getMembershipConditions: async (): Promise<Address[]> => {
      const conditions = await this.baseGroup.getMembershipConditions();
      return Array.from(conditions);
    },
  };

  // Group property setters
  public readonly setProperties = {
    owner: async (newOwner: Address): Promise<TransactionReceipt> => {
      const tx = this.baseGroup.setOwner(newOwner);
      return await this.runner.sendTransaction!([tx]);
    },

    service: async (newService: Address): Promise<TransactionReceipt> => {
      const tx = this.baseGroup.setService(newService);
      return await this.runner.sendTransaction!([tx]);
    },

    feeCollection: async (newFeeCollection: Address): Promise<TransactionReceipt> => {
      const tx = this.baseGroup.setFeeCollection(newFeeCollection);
      return await this.runner.sendTransaction!([tx]);
    },

    membershipCondition: async (
      condition: Address,
      enabled: boolean
    ): Promise<TransactionReceipt> => {
      const tx = this.baseGroup.setMembershipCondition(condition, enabled);
      return await this.runner.sendTransaction!([tx]);
    },
  };

  // Profile methods
  public readonly profile = {
    /**
     * Get the profile for this avatar from IPFS
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
     */
    update: async (profile: Profile): Promise<string> => {
      // Step 1: Pin the profile to IPFS and get CID
      const cid = await this.profiles.create(profile);
      if (!cid) {
        throw new Error('Failed to update profile. The profile service did not return a CID.');
      }

      // Step 2: Update the metadata digest
      const updateReceipt = await this.profile.updateMetadata(cid);
      if (!updateReceipt) {
        throw new Error('Failed to update profile. The CID was not updated.');
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
     * Update the metadata digest (CID)
     */
    updateMetadata: async (cid: string): Promise<TransactionReceipt> => {
      const cidHex = cidV0ToHex(cid);
      const tx = this.baseGroup.updateMetadataDigest(cidHex);
      return await this.runner.sendTransaction!([tx]);
    },

    /**
     * Register a short name for this avatar using a specific nonce
     */
    registerShortName: async (nonce: number): Promise<TransactionReceipt> => {
      const tx = this.baseGroup.registerShortNameWithNonce(BigInt(nonce));
      return await this.runner.sendTransaction!([tx]);
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
}

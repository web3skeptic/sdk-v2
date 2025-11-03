import type { RpcClient } from '../client';
import type { Address, Profile } from '@circles-sdk-v2/types';
import { normalizeAddress } from '../utils';

/**
 * Profile RPC methods
 */
export class ProfileMethods {
  constructor(private client: RpcClient) {}

  /**
   * Get a profile by its CID
   *
   * @param cid - The CID of the profile
   * @returns Profile information or null if not found
   *
   * @example
   * ```typescript
   * const profile = await rpc.profile.getProfileByCid('Qmb2s3hjxXXcFqWvDDSPCd1fXXa9gcFJd8bzdZNNAvkq9W');
   * console.log(profile);
   * ```
   */
  async getProfileByCid(cid: string): Promise<Profile | null> {
    return this.client.call<[string], Profile | null>('circles_getProfileByCid', [cid]);
  }

  /**
   * Get many profiles by CID in batch
   *
   * @param cids - Array of CIDs (null values are allowed in the array)
   * @returns Array of profiles (null for not found)
   *
   * @example
   * ```typescript
   * const profiles = await rpc.profile.getProfileByCidBatch([
   *   'Qmb2s3hjxXXcFqWvDDSPCd1fXXa9gcFJd8bzdZNNAvkq9W',
   *   null,
   *   'QmZuR1Jkhs9RLXVY28eTTRSnqbxLTBSoggp18Yde858xCM'
   * ]);
   * ```
   */
  async getProfileByCidBatch(cids: (string | null)[]): Promise<(Profile | null)[]> {
    return this.client.call<[(string | null)[]], (Profile | null)[]>(
      'circles_getProfileByCidBatch',
      [cids]
    );
  }

  /**
   * Query the profile for an avatar address
   *
   * @param address - The avatar address
   * @returns Profile information or null if not found
   *
   * @example
   * ```typescript
   * const profile = await rpc.profile.getProfileByAddress('0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7');
   * console.log(profile);
   * ```
   */
  async getProfileByAddress(address: Address): Promise<Profile | null> {
    return this.client.call<[Address], Profile | null>('circles_getProfileByAddress', [
      normalizeAddress(address),
    ]);
  }

  /**
   * Query profiles by address in batch
   *
   * @param addresses - Array of addresses (null values are allowed in the array)
   * @returns Array of profiles (null for not found)
   *
   * @example
   * ```typescript
   * const profiles = await rpc.profile.getProfileByAddressBatch([
   *   '0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7',
   *   null,
   *   '0xf712d3b31de494b5c0ea51a6a407460ca66b12e8'
   * ]);
   * ```
   */
  async getProfileByAddressBatch(addresses: (Address | null)[]): Promise<(Profile | null)[]> {
    return this.client.call<[(Address | null)[]], (Profile | null)[]>(
      'circles_getProfileByAddressBatch',
      [addresses.map((addr) => (addr === null ? null : normalizeAddress(addr)))]
    );
  }

  /**
   * Search profiles by name, description or address
   *
   * @param query - Search query string
   * @param limit - Maximum number of results (default: 10)
   * @param offset - Offset for pagination (default: 0)
   * @returns Array of matching profiles
   *
   * @example
   * ```typescript
   * const results = await rpc.profile.searchProfiles('alice', 10, 0);
   * console.log(results);
   * ```
   */
  async searchProfiles(query: string, limit: number = 10, offset: number = 0): Promise<Profile[]> {
    return this.client.call<[string, number, number], Profile[]>('circles_searchProfiles', [
      query.toLowerCase(),
      limit,
      offset,
    ]);
  }
}

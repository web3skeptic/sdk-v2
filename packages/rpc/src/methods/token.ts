import type { RpcClient } from '../client';
import type { Address, TokenInfo } from '../types';
import { normalizeAddress, parseStringsToBigInt } from '../utils';

/**
 * Token information RPC methods
 */
export class TokenMethods {
  constructor(private client: RpcClient) {}

  /**
   * Get token information for a specific token address
   *
   * @param address - The token address to query
   * @returns Token information or undefined if not found
   *
   * @example
   * ```typescript
   * const tokenInfo = await rpc.token.getTokenInfo('0x0d8c4901dd270fe101b8014a5dbecc4e4432eb1e');
   * console.log(tokenInfo);
   * ```
   */
  async getTokenInfo(address: Address): Promise<TokenInfo | undefined> {
    const results = await this.getTokenInfoBatch([address]);
    return results.length > 0 ? results[0] : undefined;
  }

  /**
   * Get token information for multiple token addresses in batch
   *
   * @param addresses - Array of token addresses to query
   * @returns Array of token information objects
   *
   * @example
   * ```typescript
   * const tokenInfos = await rpc.token.getTokenInfoBatch([
   *   '0x0d8c4901dd270fe101b8014a5dbecc4e4432eb1e',
   *   '0x86533d1ada8ffbe7b6f7244f9a1b707f7f3e239b'
   * ]);
   * ```
   */
  async getTokenInfoBatch(addresses: Address[]): Promise<TokenInfo[]> {
    if (addresses.length === 0) {
      return [];
    }

    const normalizedAddresses = addresses.map(addr => normalizeAddress(addr));
    const result = await this.client.call<[Address[]], Record<string, unknown>[]>(
      'circles_getTokenInfoBatch',
      [normalizedAddresses]
    );

    return result.map(item => parseStringsToBigInt(item)) as unknown as TokenInfo[];
  }
}

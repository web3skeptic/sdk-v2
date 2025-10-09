import type { RpcClient } from '../client';
import type { Address, TokenBalance } from '../types';
import { normalizeAddress, parseStringsToBigInt } from '../utils';

/**
 * Balance query RPC methods
 */
export class BalanceMethods {
  constructor(private client: RpcClient) {}

  /**
   * Query the balance breakdown of a specific avatar address
   *
   * @param address - The avatar address to query
   * @returns Array of token balances (amounts as bigint)
   *
   * @example
   * ```typescript
   * const balances = await rpc.balance.getTokenBalances('0x7cadf434b692ca029d950607a4b3f139c30d4e98');
   * console.log(balances);
   * ```
   */
  async getTokenBalances(address: Address): Promise<TokenBalance[]> {
    const result = await this.client.call<[Address], Record<string, unknown>[]>('circles_getTokenBalances', [
      normalizeAddress(address),
    ]);
    return result.map(item => parseStringsToBigInt(item)) as unknown as TokenBalance[];
  }
}

import type { RpcClient } from '../client';
import type { Address, FindPathParams, PathResponse } from '../types';
import { normalizeAddress, normalizeFindPathParams, parseStringsToBigInt } from '../utils';

/**
 * Circles V1 and V2 balance and pathfinding methods
 */
export class CirclesV2Methods {
  constructor(private client: RpcClient) {}

  /**
   * Get the total v1 Circles balance of an account
   *
   * @param address - The avatar address to query
   * @param asTimeCircles - Whether to return balance as TimeCircles (default: true)
   * @returns The total v1 balance as bigint
   *
   * @example
   * ```typescript
   * const balance = await rpc.circlesV2.getTotalBalanceV1('0xcadd4ea3bcc361fc4af2387937d7417be8d7dfc2');
   * console.log(balance); // 1000000000000000000n
   * ```
   */
  async getTotalBalanceV1(address: Address, asTimeCircles: boolean = true): Promise<bigint> {
    const result = await this.client.call<[Address, boolean], string>('circles_getTotalBalance', [
      normalizeAddress(address),
      asTimeCircles,
    ]);
    return BigInt(result);
  }

  /**
   * Get the total v2 Circles balance of an account
   *
   * @param address - The avatar address to query
   * @param asTimeCircles - Whether to return balance as TimeCircles (default: true)
   * @returns The total v2 balance as bigint
   *
   * @example
   * ```typescript
   * const balance = await rpc.circlesV2.getTotalBalance('0xcadd4ea3bcc361fc4af2387937d7417be8d7dfc2');
   * console.log(balance); // 1000000000000000000n
   * ```
   */
  async getTotalBalance(address: Address, asTimeCircles: boolean = true): Promise<bigint> {
    const result = await this.client.call<[Address, boolean], string>('circlesV2_getTotalBalance', [
      normalizeAddress(address),
      asTimeCircles,
    ]);
    return BigInt(result);
  }

  /**
   * Calculate a path between two addresses with a target flow
   *
   * @param params - Path finding parameters
   * @returns The computed path with transfers (amounts as bigint)
   *
   * @example
   * ```typescript
   * const path = await rpc.circlesV2.findPath({
   *   from: '0x749c930256b47049cb65adcd7c25e72d5de44b3b',
   *   to: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
   *   targetFlow: 99999999999999999999999999999999999n
   * });
   * ```
   */
  async findPath(params: FindPathParams): Promise<PathResponse> {
    const normalizedParams = normalizeFindPathParams(params);
    const result = await this.client.call<[Record<string, unknown>], Record<string, unknown>>(
      'circlesV2_findPath',
      [normalizedParams]
    );
    return parseStringsToBigInt(result) as unknown as PathResponse;
  }
}

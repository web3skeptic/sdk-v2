import type { RpcClient } from '../client';
import type { FindPathParams, PathResponse } from '@circles-sdk/types';
import { normalizeFindPathParams, parseStringsToBigInt } from '../utils';

/**
 * Circles V1 and V2 balance and pathfinding methods
 */
export class PathfinderMethods {
  constructor(private client: RpcClient) {}

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

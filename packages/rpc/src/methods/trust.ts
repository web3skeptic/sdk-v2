import type { RpcClient } from '../client';
import type { Address } from '@circles-sdk/types';
import { normalizeAddress } from '../utils';

/**
 * Trust relation RPC methods
 */
export class TrustMethods {
  constructor(private client: RpcClient) {}

  /**
   * Query the common trust relations of two addresses
   * (only common outgoing trust relations are considered)
   *
   * @param address1 - First address
   * @param address2 - Second address
   * @returns Array of common trusted addresses
   *
   * @example
   * ```typescript
   * const commonTrust = await rpc.trust.getCommonTrust(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7',
   *   '0xe8fc7a2d0573e5164597b05f14fa9a7fca7b215c'
   * );
   * ```
   */
  async getCommonTrust(address1: Address, address2: Address): Promise<Address[]> {
    return this.client.call<[Address, Address], Address[]>('circles_getCommonTrust', [
      normalizeAddress(address1),
      normalizeAddress(address2),
    ]);
  }
}

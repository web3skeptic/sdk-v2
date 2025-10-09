import type { RpcClient } from '../client';
import type { Address } from '@circles-sdk/types';
import { normalizeAddress } from '../utils';

/**
 * Invitation RPC methods
 */
export class InvitationMethods {
  constructor(private client: RpcClient) {}

  /**
   * Get the avatar that invited a specific avatar
   *
   * @param address - The address of the invited avatar
   * @returns The address of the inviting avatar or undefined if not found
   *
   * @example
   * ```typescript
   * const inviter = await rpc.invitation.getInvitedBy('0xde374ece6fa50e781e81aac78e811b33d16912c7');
   * console.log(inviter); // '0x...'
   * ```
   */
  async getInvitedBy(address: Address): Promise<Address | undefined> {
    const result = await this.client.call<[Address], Address | null>('circles_getInvitedBy', [
      normalizeAddress(address),
    ]);
    return result || undefined;
  }
}

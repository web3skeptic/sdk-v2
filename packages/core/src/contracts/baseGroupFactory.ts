import { Contract } from './contract';
import { baseGroupFactoryAbi } from '../abi';
import type { Address, TransactionRequest, Hex } from '../types';

/**
 * BaseGroupFactory Contract Wrapper
 * Provides type-safe methods for creating and managing BaseGroup instances
 *
 * This is a singleton contract deployed at a fixed address.
 */
export class BaseGroupFactoryContract extends Contract<typeof baseGroupFactoryAbi> {
  constructor(config: { address: Address; rpcUrl: string }) {
    super({
      address: config.address,
      abi: baseGroupFactoryAbi,
      rpcUrl: config.rpcUrl,
    });
  }

  /**
   * Check if a group was deployed by this factory
   */
  async deployedByFactory(group: Address): Promise<boolean> {
    return this.read('deployedByFactory', [group]) as Promise<boolean>;
  }

  /**
   * Create a new BaseGroup instance
   *
   * @param owner The address that will own the newly created BaseGroup
   * @param service The address of the service for the new BaseGroup
   * @param feeCollection The address of the fee collection for the new BaseGroup
   * @param initialConditions An array of initial condition addresses
   * @param name The group name (must be 19 characters or fewer)
   * @param symbol The group symbol
   * @param metadataDigest A hash containing additional metadata for the BaseGroup
   * @param value ETH value to send with transaction (default: 0)
   * @returns Transaction request object
   */
  createBaseGroup(
    owner: Address,
    service: Address,
    feeCollection: Address,
    initialConditions: readonly Address[],
    name: string,
    symbol: string,
    metadataDigest: Hex,
    value: bigint = BigInt(0)
  ): TransactionRequest {
    return {
      to: this.address,
      data: this.encodeWrite('createBaseGroup', [
        owner,
        service,
        feeCollection,
        initialConditions,
        name,
        symbol,
        metadataDigest,
      ]),
      value,
    };
  }
}

import type { Abi } from 'abitype';
import { encodeFunctionData, http, createPublicClient } from 'viem';
import type { Address, Hex } from '../types';

/**
 * Generic Contract class for type-safe contract interactions
 */
export class Contract<TAbi extends readonly unknown[] = Abi> {
  public readonly address: Address;
  public readonly abi: TAbi;
  protected rpcUrl: string;

  constructor(config: {
    address: Address;
    abi: TAbi;
    rpcUrl: string;
  }) {
    this.address = config.address;
    this.abi = config.abi;
    this.rpcUrl = config.rpcUrl;
  }

  /**
   * Read from contract (view/pure functions)
   */
  async read(functionName: string, args?: readonly unknown[]): Promise<unknown> {
    const client = createPublicClient({
      transport: http(this.rpcUrl),
    });

    return client.readContract({
      address: this.address,
      abi: this.abi as Abi,
      functionName,
      args,
    });
  }

  /**
   * Encode transaction data for write functions
   */
  encodeWrite(functionName: string, args?: readonly unknown[]): Hex {
    return encodeFunctionData({
      abi: this.abi as Abi,
      functionName,
      args,
    } as Parameters<typeof encodeFunctionData>[0]);
  }
}

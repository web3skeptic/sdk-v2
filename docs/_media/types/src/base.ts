import type { Abi, Address as ViemAddress } from 'abitype';

/**
 * Base types for EVM interaction
 */

/**
 * Ethereum address type
 */
export type Address = ViemAddress;

/**
 * Hexadecimal string type
 */
export type Hex = `0x${string}`;

/**
 * Transaction or block hash type
 */
export type Hash = `0x${string}`;

/**
 * Generic contract configuration
 */
export interface ContractConfig<TAbi extends Abi = Abi> {
  address: Address;
  abi: TAbi;
}

/**
 * Transaction request object
 * Contains all data needed to send a transaction
 */
export interface TransactionRequest {
  from?: Address;
  to: Address;
  data: Hex;
  value?: bigint;
  gas?: bigint;
  gasPrice?: bigint;
  nonce?: number;
}

/**
 * Call result
 */
export interface CallResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
}

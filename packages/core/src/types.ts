import type { Abi, ExtractAbiFunctions } from 'abitype';

/**
 * Base types for EVM interaction
 */
export type Address = `0x${string}`;

export type Hex = `0x${string}`;

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
 * Transaction response
 */
export interface TransactionResponse {
  hash: Hash;
  from: Address;
  to?: Address;
  data: Hex;
  value: bigint;
  blockNumber?: number;
  blockHash?: Hash;
}

/**
 * Call result
 */
export interface CallResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: Error;
}

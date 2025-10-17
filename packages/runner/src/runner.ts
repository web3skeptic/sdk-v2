import type { Address, TransactionRequest, TransactionResponse } from '@circles-sdk/types';
import type { Account, Chain, PublicClient, Transport, WalletClient } from 'viem';

/**
 * Batch transaction runner interface
 * Allows multiple transactions to be batched and executed atomically
 */
export interface BatchRun {
  /**
   * Add a transaction to the batch
   */
  addTransaction(tx: TransactionRequest): void;

  /**
   * Execute all batched transactions
   * @returns Single transaction response for the entire batch
   */
  run(): Promise<TransactionResponse>;
}

/**
 * Contract runner interface for executing blockchain operations
 * This is the base interface that all contract runners must implement
 */
export interface ContractRunner {
  /**
   * The address of the account (if available)
   */
  address?: Address;

  /**
   * The public client for reading blockchain state
   */
  publicClient: PublicClient;

  /**
   * Initialize the runner
   */
  init(): Promise<void>;

  /**
   * Estimate gas for a transaction
   */
  estimateGas?(tx: TransactionRequest): Promise<bigint>;

  /**
   * Call a contract (read-only)
   */
  call?(tx: TransactionRequest): Promise<string>;

  /**
   * Resolve an ENS name to an address
   */
  resolveName?(name: string): Promise<string | null>;

  /**
   * Send one or more transactions
   * - Safe: batches all transactions atomically and returns single TransactionResponse
   * - EOA: does not support multiple transactions
   */
  sendTransaction?(
    txs: TransactionRequest[]
  ): Promise<TransactionResponse>;

  /**
   * Create a batch transaction runner (if supported)
   * This allows multiple transactions to be executed atomically in a single on-chain transaction
   * Typically used with Safe multisig or other smart contract wallets
   *
   * @returns A BatchRun instance for adding transactions and executing them as a batch
   */
  sendBatchTransaction?(): BatchRun;
  //@todo add sign function
}

import type { Address, TransactionRequest, TransactionResponse } from '@circles-sdk/types';
import type { Account, Chain, PublicClient, Transport, WalletClient } from 'viem';

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
   * Send a transaction
   */
  sendTransaction?(tx: TransactionRequest): Promise<TransactionResponse>;
  //@todo add sign function
}

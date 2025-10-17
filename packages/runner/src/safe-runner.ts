import type { Address, Hex, TransactionRequest, TransactionResponse } from '@circles-sdk/types';
import type { ContractRunner, BatchRun } from './runner';
import type { PublicClient } from 'viem';
import type { SafeTransaction } from '@safe-global/types-kit';
import { type MetaTransactionData, OperationType } from '@safe-global/safe-core-sdk-types';

// Use require for Safe to ensure compatibility with bun's CJS/ESM interop
// Safe Protocol Kit v5 uses CommonJS exports, so we use require() for proper interop
// eslint-disable-next-line @typescript-eslint/no-var-requires
const SafeModule = require('@safe-global/protocol-kit');
const Safe = SafeModule.default || SafeModule;

/**
 * Batch transaction runner for Safe
 * Allows multiple transactions to be batched and executed together
 */
export class SafeBatchRun implements BatchRun {
  private readonly transactions: TransactionRequest[] = [];

  constructor(private readonly safe: any) {}

  /**
   * Add a transaction to the batch
   */
  addTransaction(tx: TransactionRequest) {
    this.transactions.push(tx);
  }

  /**
   * Get the Safe transaction data for all batched transactions
   */
  async getSafeTransaction() {
    const metaTransactions: MetaTransactionData[] = this.transactions.map((tx) => ({
      operation: OperationType.Call,
      to: tx.to!,
      value: (tx.value?.toString() ?? '0'),
      data: tx.data ?? '0x',
    }));

    const safeTransaction = await this.safe.createTransaction({
      transactions: metaTransactions,
    });

    return safeTransaction;
  }

  /**
   * Execute all batched transactions
   */
  async run(): Promise<TransactionResponse> {
    const safeTransaction = await this.getSafeTransaction();

    const txResult = await this.safe.executeTransaction(safeTransaction);

    if (!txResult.hash) {
      throw new Error('Transaction execution failed: no transaction hash');
    }

    const response: TransactionResponse = {
      hash: txResult.hash as Hex,
      from: (await this.safe.getAddress()) as Address,
      to: undefined,
      data: '0x' as Hex,
      value: BigInt(0),
      blockNumber: 0,
      blockHash: '0x' as Hex,
    };

    return response;
  }
}

/**
 * Safe contract runner implementation using Safe Protocol Kit
 * Executes transactions through a Safe multisig wallet
 */
export class SafeContractRunner implements ContractRunner {
  public address?: Address;
  public publicClient: PublicClient;

  private privateKey: Hex;
  private rpcUrl: string;
  private safeAddress?: Address;
  private safe?: any;

  /**
   * Creates a new SafeContractRunner
   * @param publicClient - The viem public client for reading blockchain state
   * @param privateKey - The private key of one of the Safe signers
   * @param rpcUrl - The RPC URL to use for Safe operations
   * @param safeAddress - The address of the Safe wallet (optional, can be set in init)
   */
  // @todo rpc might be taken from public client
  constructor(
    publicClient: PublicClient,
    privateKey: Hex,
    rpcUrl: string,
    safeAddress?: Address
  ) {
    this.publicClient = publicClient;
    this.privateKey = privateKey;
    this.rpcUrl = rpcUrl;
    this.safeAddress = safeAddress;
  }

  /**
   * Initialize the runner with a Safe address
   * @param safeAddress - The address of the Safe wallet (optional if provided in constructor)
   */
  async init(safeAddress?: Address): Promise<void> {
    // Use provided address or the one from constructor
    const targetSafeAddress = safeAddress || this.safeAddress;

    if (!targetSafeAddress) {
      throw new Error('Safe address must be provided either in constructor or init()');
    }

    this.safeAddress = targetSafeAddress;
    this.address = targetSafeAddress;

    // Initialize Safe Protocol Kit
    this.safe = await Safe.init({
      provider: this.rpcUrl,
      signer: this.privateKey,
      safeAddress: targetSafeAddress,
    });
  }

  /**
   * Ensures the Safe is initialized
   */
  private ensureSafe(): any {
    if (!this.safe) {
      throw new Error('SafeContractRunner not initialized. Call init() first.');
    }
    return this.safe;
  }

  /**
   * Estimate gas for a transaction
   */
  estimateGas = async (tx: TransactionRequest): Promise<bigint> => {
    const estimate = await this.publicClient.estimateGas({
      // @ts-expect-error - Address type is compatible with viem's 0x${string}
      account: this.address,
      // @ts-expect-error - Address type is compatible with viem's 0x${string}
      to: tx.to!,
      data: tx.data,
      value: tx.value,
    });

    return estimate;
  };

  /**
   * Call a contract (read-only operation)
   */
  call = async (tx: TransactionRequest): Promise<string> => {
    const result = await this.publicClient.call({
      // @ts-expect-error - Address type is compatible with viem's 0x${string}
      account: tx.from || this.address,
      // @ts-expect-error - Address type is compatible with viem's 0x${string}
      to: tx.to,
      data: tx.data,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
    });

    return result.data || '0x';
  };

  /**
   * Resolve an ENS name to an address
   */
  resolveName = async (name: string): Promise<string | null> => {
    try {
      const address = await this.publicClient.getEnsAddress({
        name,
      });
      return address;
    } catch (error) {
      // ENS resolution failed or not supported
      return null;
    }
  };

  /**
   * Send one or more transactions through the Safe
   * All transactions are batched and executed atomically
   */
  sendTransaction = async (txs: TransactionRequest[]): Promise<TransactionResponse> => {
    const safe = this.ensureSafe();

    if (txs.length === 0) {
      throw new Error('No transactions provided');
    }

    const metaTransactions: MetaTransactionData[] = txs.map((tx) => ({
      operation: OperationType.Call,
      to: tx.to!,
      value: (tx.value?.toString() ?? '0'),
      data: tx.data ?? '0x',
    }));

    // Create Safe transaction with all transactions
    const safeTransaction = await safe.createTransaction({
      transactions: metaTransactions,
    });

    // Execute the batched transaction with explicit gas limit to avoid estimation errors
    // This prevents "wrong transaction nonce" errors during gas estimation
    const txResult = await safe.executeTransaction(safeTransaction, {
      gasLimit: 10000000, // 10M gas - sufficient for most Safe transactions
    });

    if (!txResult.hash) {
      throw new Error('Transaction execution failed: no transaction hash');
    }

    // Build response
    const response: TransactionResponse = {
      hash: txResult.hash as Hex,
      from: (await safe.getAddress()) as Address,
      to: undefined,
      data: '0x' as Hex,
      value: BigInt(0),
      blockNumber: 0,
      blockHash: '0x' as Hex,
    };

    return response;
  };

  /**
   * Create a batch transaction runner
   * @returns A SafeBatchRun instance for batching multiple transactions
   */
  sendBatchTransaction = (): SafeBatchRun => {
    const safe = this.ensureSafe();
    return new SafeBatchRun(safe);
  };
}

import type { Address, Hex, TransactionRequest, TransactionResponse } from '@circles-sdk/types';
import type { ContractRunner } from './runner';
import {
  type Account,
  type Chain,
  type PublicClient,
  type Transport,
  type WalletClient,
  createWalletClient,
  http,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';

/**
 * EOA (Externally Owned Account) contract runner implementation using a private key
 * Uses viem's wallet client to sign and send transactions
 */
export class EoaContractRunner implements ContractRunner {
  public address?: Address;
  public publicClient: PublicClient;

  private privateKey: Hex;
  private rpcUrl: string;
  private _walletClient?: WalletClient<Transport, Chain, Account>;
  private _account?: Account;

  /**
   * Creates a new EoaContractRunner
   * @param publicClient - The viem public client for reading blockchain state
   * @param privateKey - The private key to use for signing transactions (must start with 0x)
   * @param rpcUrl - The RPC URL to use for the wallet client
   */
  constructor(publicClient: PublicClient, privateKey: Hex, rpcUrl: string) {
    this.publicClient = publicClient;
    this.privateKey = privateKey;
    this.rpcUrl = rpcUrl;
  }

  /**
   * Initialize the runner by creating the account and wallet client
   */
  async init(): Promise<void> {
    // Create account from private key
    this._account = privateKeyToAccount(this.privateKey);
    this.address = this._account.address;

    // Ensure chain is defined
    if (!this.publicClient.chain) {
      throw new Error('PublicClient must have a chain defined');
    }

    // Create wallet client with http transport
    this._walletClient = createWalletClient({
      account: this._account,
      chain: this.publicClient.chain,
      transport: http(this.rpcUrl),
    });
  }

  /**
   * Ensures the wallet client is initialized
   */
  private ensureWalletClient(): WalletClient<Transport, Chain, Account> {
    if (!this._walletClient) {
      throw new Error('EoaContractRunner not initialized. Call init() first.');
    }
    return this._walletClient;
  }

  /**
   * Estimate gas for a transaction
   */
  estimateGas = async (tx: TransactionRequest): Promise<bigint> => {
    this.ensureWalletClient(); // Ensure initialized

    const estimate = await this.publicClient.estimateGas({
      account: this._account!,
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
      account: tx.from || this._account,
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
   * Send a transaction
   */
  sendTransaction = async (tx: TransactionRequest): Promise<TransactionResponse> => {
    const walletClient = this.ensureWalletClient();

    // Send the transaction
    const hash = await walletClient.sendTransaction({
      account: this._account!,
      // @ts-expect-error - Address type is compatible with viem's 0x${string}
      to: tx.to!,
      data: tx.data,
      value: tx.value,
      gas: tx.gas,
      gasPrice: tx.gasPrice,
      nonce: tx.nonce,
      chain: this.publicClient.chain,
    });

    // Wait for transaction receipt
    const receipt = await this.publicClient.waitForTransactionReceipt({
      hash,
    });

    // Get the full transaction details
    const transaction = await this.publicClient.getTransaction({
      hash,
    });

    // Build response
    const response: TransactionResponse = {
      hash,
      from: transaction.from,
      to: transaction.to || undefined,
      data: transaction.input,
      value: transaction.value,
      blockNumber: Number(receipt.blockNumber),
      blockHash: receipt.blockHash,
    };

    return response;
  };
}

// Legacy export for backwards compatibility
export { EoaContractRunner as PrivateKeyContractRunner };

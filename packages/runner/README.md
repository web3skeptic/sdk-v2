# @aboutcircles/sdk-runner

Safe multisig wallet integration for executing blockchain operations with the Circles SDK.

## Overview

This package provides the `SafeContractRunner` implementation for executing transactions through Safe multisig wallets. It handles transaction batching, signing, and confirmation, making it easy to interact with Circles protocol using Safe wallets.

## Installation

```bash
npm install @aboutcircles/sdk-runner
```

## Usage

### SafeContractRunner

The `SafeContractRunner` executes transactions through a Safe multisig wallet.

```typescript
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';

// Create a public client
const publicClient = createPublicClient({
  chain: gnosis,
  transport: http('https://rpc.gnosischain.com'),
});

// Create the runner
const runner = new SafeContractRunner(
  publicClient,
  '0x...', // private key of Safe signer
  'https://rpc.gnosischain.com',
  '0x...' // Safe address
);

// Initialize the runner
await runner.init();

// Send a single transaction
const receipt = await runner.sendTransaction([{
  to: '0x...',
  data: '0x...',
  value: 0n,
}]);

console.log('Transaction hash:', receipt.transactionHash);
console.log('Status:', receipt.status);
console.log('Gas used:', receipt.gasUsed);

// Batch multiple transactions atomically
const batchReceipt = await runner.sendTransaction([
  { to: '0x...', data: '0x...', value: 0n },
  { to: '0x...', data: '0x...', value: 0n },
  { to: '0x...', data: '0x...', value: 0n },
]);
```

## Features

- **Transaction Confirmation**: Automatically waits for transactions to be mined
- **Status Checking**: Throws errors if transactions revert
- **Atomic Batching**: Execute multiple transactions in a single Safe transaction
- **Full Receipt Data**: Returns complete viem TransactionReceipt with gas, logs, etc.

## API

### ContractRunner Interface

```typescript
interface ContractRunner {
  address?: Address;
  publicClient: PublicClient;

  init(): Promise<void>;
  estimateGas?(tx: TransactionRequest): Promise<bigint>;
  call?(tx: TransactionRequest): Promise<string>;
  resolveName?(name: string): Promise<string | null>;
  sendTransaction?(txs: TransactionRequest[]): Promise<TransactionResponse>;
  sendBatchTransaction?(): BatchRun;
}
```

### SafeContractRunner

```typescript
class SafeContractRunner implements ContractRunner {
  constructor(
    publicClient: PublicClient,
    privateKey: Hex,
    rpcUrl: string,
    safeAddress?: Address
  );

  init(safeAddress?: Address): Promise<void>;
  sendTransaction(txs: TransactionRequest[]): Promise<TransactionResponse>;
  sendBatchTransaction(): SafeBatchRun;
}
```

## License

MIT

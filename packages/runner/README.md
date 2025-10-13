# @circles-sdk/runner

Contract runner implementations for executing blockchain operations with the Circles SDK.

## Overview

This package provides contract runner implementations that handle transaction signing and execution. Contract runners abstract away the details of how transactions are signed, allowing you to easily switch between different signing methods (private key, hardware wallet, etc.).

## Installation

```bash
npm install @circles-sdk/runner
```

## Usage

### PrivateKeyContractRunner

The `PrivateKeyContractRunner` uses a private key to sign transactions.

```typescript
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';
import { PrivateKeyContractRunner } from '@circles-sdk/runner';

// Create a public client
const publicClient = createPublicClient({
  chain: gnosis,
  transport: http('https://rpc.gnosischain.com'),
});

// Create the runner
const runner = new PrivateKeyContractRunner(
  publicClient,
  '0x...' // your private key
);

// Initialize the runner
await runner.init();

// Now you can use the runner to send transactions
const response = await runner.sendTransaction({
  to: '0x...',
  data: '0x...',
  value: 0n,
});

console.log('Transaction hash:', response.hash);
```

## API

### ContractRunner Interface

The base interface that all runners implement:

```typescript
interface ContractRunner {
  address?: Address;
  publicClient: PublicClient;

  init(): Promise<void>;
  estimateGas?(tx: TransactionRequest): Promise<bigint>;
  call?(tx: TransactionRequest): Promise<string>;
  resolveName?(name: string): Promise<string | null>;
  sendTransaction?(tx: TransactionRequest): Promise<TransactionResponse>;
}
```

### PrivateKeyContractRunner

```typescript
class PrivateKeyContractRunner implements ContractRunner {
  constructor(publicClient: PublicClient, privateKey: Hex);

  // Implements all ContractRunner methods
}
```

## License

MIT

# Circles contracts wrapper

TypeScript SDK for Circles protocol contracts with full type safety.

## Installation

```bash
bun add @circles/core
```

## Usage

```typescript
import { Core, circlesConfig, BaseGroupContract } from '@circles/core';

// Use default Gnosis Chain configuration
const core = new Core();

console.log('Using RPC:', core.rpcUrl);
console.log('HubV2 address:', core.config.v2HubAddress);

// Use HubV2 contract (singleton, accessed via core.hubV2)
const groupMintTx = core.hubV2.groupMint(
  '0x1234567890123456789012345678901234567890',
  ['0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002'],
  [BigInt(100), BigInt(200)],
  '0x'
);

console.log('GroupMint Transaction:', groupMintTx);

// Create a new BaseGroup using the factory
const createGroupTx = core.baseGroupFactory.createBaseGroup(
  '0x0000000000000000000000000000000000000001', // owner
  '0x0000000000000000000000000000000000000002', // service
  '0x0000000000000000000000000000000000000003', // feeCollection
  [], // initial conditions
  'MyGroup',
  'MYG',
  '0x0000000000000000000000000000000000000000000000000000000000000000'
);

console.log('CreateGroup Transaction:', createGroupTx);

// Use BaseGroup contract (multiple instances, create with specific address)
const baseGroup = new BaseGroupContract({
  address: '0x1234567890123456789012345678901234567890', // specific BaseGroup instance
  rpcUrl: core.rpcUrl // reuse the same RPC
});

// Create a transaction to trust members with conditions
const trustBatchTx = baseGroup.trustBatchWithConditions(
  ['0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002'],
  BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60) // 1 year from now
);

console.log('TrustBatch Transaction:', trustBatchTx);

// Use custom RPC URL
const coreCustomRpc = new Core(circlesConfig[100], 'https://custom-rpc.example.com');
console.log('Custom RPC:', coreCustomRpc.rpcUrl);
```

## Features

- Full TypeScript type safety with abitype
- Default Gnosis Chain configuration
- HubV2 contract wrapper (singleton)
- BaseGroup contract wrapper (multiple instances)
- BaseGroupFactory for creating groups
- Custom RPC URL support

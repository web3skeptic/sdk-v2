[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [runner/src](../README.md) / SafeContractRunner

# Class: SafeContractRunner

Defined in: [packages/runner/src/safe-runner.ts:88](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L88)

Safe contract runner implementation using Safe Protocol Kit
Executes transactions through a Safe multisig wallet

## Implements

- `ContractRunner`

## Constructors

### Constructor

> **new SafeContractRunner**(`publicClient`, `privateKey`, `rpcUrl`, `safeAddress?`): `SafeContractRunner`

Defined in: [packages/runner/src/safe-runner.ts:105](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L105)

Creates a new SafeContractRunner

#### Parameters

##### publicClient

The viem public client for reading blockchain state

##### privateKey

`` `0x${string}` ``

The private key of one of the Safe signers

##### rpcUrl

`string`

The RPC URL to use for Safe operations

##### safeAddress?

`string`

The address of the Safe wallet (optional, can be set in init)

#### Returns

`SafeContractRunner`

## Properties

### address?

> `optional` **address**: `string`

Defined in: [packages/runner/src/safe-runner.ts:89](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L89)

The address of the account (if available)

#### Implementation of

`ContractRunner.address`

***

### publicClient

> **publicClient**: `object`

Defined in: [packages/runner/src/safe-runner.ts:90](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L90)

The public client for reading blockchain state

#### Implementation of

`ContractRunner.publicClient`

## Methods

### create()

> `static` **create**(`rpcUrl`, `privateKey`, `safeAddress`, `chain`): `Promise`\<`SafeContractRunner`\>

Defined in: [packages/runner/src/safe-runner.ts:138](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L138)

Create and initialize a SafeContractRunner in one step

#### Parameters

##### rpcUrl

`string`

The RPC URL to connect to

##### privateKey

`` `0x${string}` ``

The private key of one of the Safe signers

##### safeAddress

`string`

The address of the Safe wallet

##### chain

`Chain`

The viem chain configuration (e.g., gnosis from 'viem/chains')

#### Returns

`Promise`\<`SafeContractRunner`\>

An initialized SafeContractRunner instance

#### Example

```typescript
import { gnosis } from 'viem/chains';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';

const runner = await SafeContractRunner.create(
  'https://rpc.gnosischain.com',
  '0xYourPrivateKey...',
  '0xYourSafeAddress...',
  gnosis
);
```

***

### init()

> **init**(`safeAddress?`): `Promise`\<`void`\>

Defined in: [packages/runner/src/safe-runner.ts:158](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L158)

Initialize the runner with a Safe address

#### Parameters

##### safeAddress?

`string`

The address of the Safe wallet (optional if provided in constructor)

#### Returns

`Promise`\<`void`\>

#### Implementation of

`ContractRunner.init`

***

### estimateGas()

> **estimateGas**(`tx`): `Promise`\<`bigint`\>

Defined in: [packages/runner/src/safe-runner.ts:190](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L190)

Estimate gas for a transaction

#### Parameters

##### tx

`TransactionRequest`

#### Returns

`Promise`\<`bigint`\>

#### Implementation of

`ContractRunner.estimateGas`

***

### call()

> **call**(`tx`): `Promise`\<`string`\>

Defined in: [packages/runner/src/safe-runner.ts:206](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L206)

Call a contract (read-only operation)

#### Parameters

##### tx

`TransactionRequest`

#### Returns

`Promise`\<`string`\>

#### Implementation of

`ContractRunner.call`

***

### resolveName()

> **resolveName**(`name`): `Promise`\<`string` \| `null`\>

Defined in: [packages/runner/src/safe-runner.ts:224](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L224)

Resolve an ENS name to an address

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

#### Implementation of

`ContractRunner.resolveName`

***

### sendTransaction()

> **sendTransaction**(`txs`): `Promise`\<`TransactionReceipt`\>

Defined in: [packages/runner/src/safe-runner.ts:242](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L242)

Send one or more transactions through the Safe and wait for confirmation
All transactions are batched and executed atomically

#### Parameters

##### txs

`TransactionRequest`[]

#### Returns

`Promise`\<`TransactionReceipt`\>

#### Throws

If transaction reverts or execution fails

#### Implementation of

`ContractRunner.sendTransaction`

***

### sendBatchTransaction()

> **sendBatchTransaction**(): [`SafeBatchRun`](SafeBatchRun.md)

Defined in: [packages/runner/src/safe-runner.ts:290](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L290)

Create a batch transaction runner

#### Returns

[`SafeBatchRun`](SafeBatchRun.md)

A SafeBatchRun instance for batching multiple transactions

#### Implementation of

`ContractRunner.sendBatchTransaction`

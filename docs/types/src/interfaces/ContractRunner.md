[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / ContractRunner

# Interface: ContractRunner

Defined in: [packages/types/src/runner.ts:29](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L29)

Contract runner interface for executing blockchain operations
This is the base interface that all contract runners must implement

## Properties

### address?

> `optional` **address**: `` `0x${string}` ``

Defined in: [packages/types/src/runner.ts:33](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L33)

The address of the account (if available)

***

### publicClient

> **publicClient**: `any`

Defined in: [packages/types/src/runner.ts:38](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L38)

The public client for reading blockchain state

## Methods

### init()

> **init**(): `Promise`\<`void`\>

Defined in: [packages/types/src/runner.ts:43](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L43)

Initialize the runner

#### Returns

`Promise`\<`void`\>

***

### estimateGas()?

> `optional` **estimateGas**(`tx`): `Promise`\<`bigint`\>

Defined in: [packages/types/src/runner.ts:48](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L48)

Estimate gas for a transaction

#### Parameters

##### tx

[`TransactionRequest`](TransactionRequest.md)

#### Returns

`Promise`\<`bigint`\>

***

### call()?

> `optional` **call**(`tx`): `Promise`\<`string`\>

Defined in: [packages/types/src/runner.ts:53](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L53)

Call a contract (read-only)

#### Parameters

##### tx

[`TransactionRequest`](TransactionRequest.md)

#### Returns

`Promise`\<`string`\>

***

### resolveName()?

> `optional` **resolveName**(`name`): `Promise`\<`string` \| `null`\>

Defined in: [packages/types/src/runner.ts:58](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L58)

Resolve an ENS name to an address

#### Parameters

##### name

`string`

#### Returns

`Promise`\<`string` \| `null`\>

***

### sendTransaction()?

> `optional` **sendTransaction**(`txs`): `Promise`\<`any`\>

Defined in: [packages/types/src/runner.ts:64](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L64)

Send one or more transactions
- Safe: batches all transactions atomically and returns single TransactionReceipt

#### Parameters

##### txs

[`TransactionRequest`](TransactionRequest.md)[]

#### Returns

`Promise`\<`any`\>

***

### sendBatchTransaction()?

> `optional` **sendBatchTransaction**(): [`BatchRun`](BatchRun.md)

Defined in: [packages/types/src/runner.ts:75](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L75)

Create a batch transaction runner (if supported)
This allows multiple transactions to be executed atomically in a single on-chain transaction
Typically used with Safe multisig or other smart contract wallets

#### Returns

[`BatchRun`](BatchRun.md)

A BatchRun instance for adding transactions and executing them as a batch

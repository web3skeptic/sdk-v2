[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [runner/src](../README.md) / SafeBatchRun

# Class: SafeBatchRun

Defined in: [packages/runner/src/safe-runner.ts:19](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L19)

Batch transaction runner for Safe
Allows multiple transactions to be batched and executed together

## Implements

- `BatchRun`

## Constructors

### Constructor

> **new SafeBatchRun**(`safe`, `publicClient`): `SafeBatchRun`

Defined in: [packages/runner/src/safe-runner.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L22)

#### Parameters

##### safe

`any`

##### publicClient

#### Returns

`SafeBatchRun`

## Methods

### addTransaction()

> **addTransaction**(`tx`): `void`

Defined in: [packages/runner/src/safe-runner.ts:30](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L30)

Add a transaction to the batch

#### Parameters

##### tx

`TransactionRequest`

#### Returns

`void`

#### Implementation of

`BatchRun.addTransaction`

***

### getSafeTransaction()

> **getSafeTransaction**(): `Promise`\<`any`\>

Defined in: [packages/runner/src/safe-runner.ts:37](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L37)

Get the Safe transaction data for all batched transactions

#### Returns

`Promise`\<`any`\>

***

### run()

> **run**(): `Promise`\<`TransactionReceipt`\>

Defined in: [packages/runner/src/safe-runner.ts:56](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-runner.ts#L56)

Execute all batched transactions and wait for confirmation

#### Returns

`Promise`\<`TransactionReceipt`\>

#### Throws

If transaction reverts or execution fails

#### Implementation of

`BatchRun.run`

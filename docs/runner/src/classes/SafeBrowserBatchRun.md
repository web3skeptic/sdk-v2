[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [runner/src](../README.md) / SafeBrowserBatchRun

# Class: SafeBrowserBatchRun

Defined in: [packages/runner/src/safe-browser-runner.ts:257](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-browser-runner.ts#L257)

Batch transaction runner for Safe browser operations
Allows multiple transactions to be batched and executed together

## Implements

- `BatchRun`

## Constructors

### Constructor

> **new SafeBrowserBatchRun**(`safe`, `publicClient`): `SafeBrowserBatchRun`

Defined in: [packages/runner/src/safe-browser-runner.ts:260](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-browser-runner.ts#L260)

#### Parameters

##### safe

`any`

##### publicClient

#### Returns

`SafeBrowserBatchRun`

## Methods

### addTransaction()

> **addTransaction**(`tx`): `void`

Defined in: [packages/runner/src/safe-browser-runner.ts:268](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-browser-runner.ts#L268)

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

Defined in: [packages/runner/src/safe-browser-runner.ts:275](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-browser-runner.ts#L275)

Get the Safe transaction data for all batched transactions

#### Returns

`Promise`\<`any`\>

***

### run()

> **run**(): `Promise`\<`TransactionReceipt`\>

Defined in: [packages/runner/src/safe-browser-runner.ts:296](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/runner/src/safe-browser-runner.ts#L296)

Execute all batched transactions and wait for confirmation
The user will be prompted to sign the transaction through their Web3 wallet

#### Returns

`Promise`\<`TransactionReceipt`\>

#### Throws

If transaction reverts or execution fails

#### Implementation of

`BatchRun.run`

[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / BatchRun

# Interface: BatchRun

Defined in: [packages/types/src/runner.ts:12](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L12)

Batch transaction runner interface
Allows multiple transactions to be batched and executed atomically

## Methods

### addTransaction()

> **addTransaction**(`tx`): `void`

Defined in: [packages/types/src/runner.ts:16](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L16)

Add a transaction to the batch

#### Parameters

##### tx

[`TransactionRequest`](TransactionRequest.md)

#### Returns

`void`

***

### run()

> **run**(): `Promise`\<`any`\>

Defined in: [packages/types/src/runner.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/runner.ts#L22)

Execute all batched transactions

#### Returns

`Promise`\<`any`\>

Single transaction receipt for the entire batch

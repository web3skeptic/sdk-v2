[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / BatchRun

# Interface: BatchRun

Defined in: [packages/types/src/runner.ts:12](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/runner.ts#L12)

Batch transaction runner interface
Allows multiple transactions to be batched and executed atomically

## Methods

### addTransaction()

```ts
addTransaction(tx): void;
```

Defined in: [packages/types/src/runner.ts:16](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/runner.ts#L16)

Add a transaction to the batch

#### Parameters

##### tx

[`TransactionRequest`](TransactionRequest.md)

#### Returns

`void`

***

### run()

```ts
run(): Promise<any>;
```

Defined in: [packages/types/src/runner.ts:22](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/runner.ts#L22)

Execute all batched transactions

#### Returns

`Promise`\<`any`\>

Single transaction receipt for the entire batch

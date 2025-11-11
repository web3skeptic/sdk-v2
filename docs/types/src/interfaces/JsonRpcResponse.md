[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / JsonRpcResponse

# Interface: JsonRpcResponse\<TResult\>

Defined in: [packages/types/src/rpc.ts:18](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/rpc.ts#L18)

JSON-RPC response structure

## Type Parameters

### TResult

`TResult` = `unknown`

## Properties

### jsonrpc

> **jsonrpc**: `"2.0"`

Defined in: [packages/types/src/rpc.ts:19](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/rpc.ts#L19)

***

### id

> **id**: `string` \| `number`

Defined in: [packages/types/src/rpc.ts:20](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/rpc.ts#L20)

***

### result?

> `optional` **result**: `TResult`

Defined in: [packages/types/src/rpc.ts:21](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/rpc.ts#L21)

***

### error?

> `optional` **error**: `object`

Defined in: [packages/types/src/rpc.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/rpc.ts#L22)

#### code

> **code**: `number`

#### message

> **message**: `string`

#### data?

> `optional` **data**: `unknown`

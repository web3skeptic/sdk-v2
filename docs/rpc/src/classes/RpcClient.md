[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [rpc/src](../README.md) / RpcClient

# Class: RpcClient

Defined in: [packages/rpc/src/client.ts:10](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/client.ts#L10)

Base RPC client for making JSON-RPC calls to Circles RPC endpoints
Supports both HTTP requests and WebSocket subscriptions

## Constructors

### Constructor

> **new RpcClient**(`rpcUrl`): `RpcClient`

Defined in: [packages/rpc/src/client.ts:27](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/client.ts#L27)

#### Parameters

##### rpcUrl

`string`

#### Returns

`RpcClient`

## Methods

### call()

> **call**\<`TParams`, `TResult`\>(`method`, `params`): `Promise`\<`TResult`\>

Defined in: [packages/rpc/src/client.ts:34](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/client.ts#L34)

Make a JSON-RPC call

#### Type Parameters

##### TParams

`TParams` = `unknown`[]

##### TResult

`TResult` = `unknown`

#### Parameters

##### method

`string`

##### params

`TParams`

#### Returns

`Promise`\<`TResult`\>

***

### setRpcUrl()

> **setRpcUrl**(`rpcUrl`): `void`

Defined in: [packages/rpc/src/client.ts:85](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/client.ts#L85)

Update the RPC URL

#### Parameters

##### rpcUrl

`string`

#### Returns

`void`

***

### getRpcUrl()

> **getRpcUrl**(): `string`

Defined in: [packages/rpc/src/client.ts:92](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/client.ts#L92)

Get the current RPC URL

#### Returns

`string`

***

### subscribe()

> **subscribe**(`address?`): `Promise`\<[`Observable`](Observable.md)\<`CirclesEvent`\>\>

Defined in: [packages/rpc/src/client.ts:217](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/client.ts#L217)

Subscribe to Circles events via WebSocket

#### Parameters

##### address?

`` `0x${string}` ``

Optional address to filter events for a specific avatar

#### Returns

`Promise`\<[`Observable`](Observable.md)\<`CirclesEvent`\>\>

Observable that emits CirclesEvent objects

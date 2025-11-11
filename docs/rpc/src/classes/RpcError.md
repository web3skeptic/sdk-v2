[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [rpc/src](../README.md) / RpcError

# Class: RpcError

Defined in: [packages/rpc/src/errors.ts:20](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L20)

RPC-related errors

## Extends

- `CirclesError`\<[`RpcErrorSource`](../type-aliases/RpcErrorSource.md)\>

## Constructors

### Constructor

> **new RpcError**(`message`, `options?`): `RpcError`

Defined in: [packages/rpc/src/errors.ts:21](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L21)

#### Parameters

##### message

`string`

##### options?

###### code?

`string` \| `number`

###### source?

[`RpcErrorSource`](../type-aliases/RpcErrorSource.md)

###### cause?

`unknown`

###### context?

`Record`\<`string`, `any`\>

#### Returns

`RpcError`

#### Overrides

`CirclesError<RpcErrorSource>.constructor`

## Methods

### connectionFailed()

> `static` **connectionFailed**(`url`, `cause?`): `RpcError`

Defined in: [packages/rpc/src/errors.ts:36](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L36)

Create error for connection failures

#### Parameters

##### url

`string`

##### cause?

`unknown`

#### Returns

`RpcError`

***

### timeout()

> `static` **timeout**(`method`, `timeout`): `RpcError`

Defined in: [packages/rpc/src/errors.ts:48](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L48)

Create error for timeout

#### Parameters

##### method

`string`

##### timeout

`number`

#### Returns

`RpcError`

***

### invalidResponse()

> `static` **invalidResponse**(`method`, `response`): `RpcError`

Defined in: [packages/rpc/src/errors.ts:59](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L59)

Create error for invalid response

#### Parameters

##### method

`string`

##### response

`any`

#### Returns

`RpcError`

***

### fromJsonRpcError()

> `static` **fromJsonRpcError**(`error`): `RpcError`

Defined in: [packages/rpc/src/errors.ts:70](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L70)

Create error from JSON-RPC error response

#### Parameters

##### error

###### code

`number`

###### message

`string`

###### data?

`any`

#### Returns

`RpcError`

***

### websocketError()

> `static` **websocketError**(`message`, `cause?`): `RpcError`

Defined in: [packages/rpc/src/errors.ts:81](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/errors.ts#L81)

Create error for WebSocket failures

#### Parameters

##### message

`string`

##### cause?

`unknown`

#### Returns

`RpcError`

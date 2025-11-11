[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [core/src](../README.md) / NetworkError

# Class: NetworkError

Defined in: [packages/core/src/errors.ts:110](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/core/src/errors.ts#L110)

Network-related errors

## Extends

- `CirclesError`\<[`CoreErrorSource`](../type-aliases/CoreErrorSource.md)\>

## Constructors

### Constructor

> **new NetworkError**(`message`, `options?`): `NetworkError`

Defined in: [packages/core/src/errors.ts:111](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/core/src/errors.ts#L111)

#### Parameters

##### message

`string`

##### options?

###### code?

`string` \| `number`

###### cause?

`unknown`

###### context?

`Record`\<`string`, `any`\>

#### Returns

`NetworkError`

#### Overrides

`CirclesError<CoreErrorSource>.constructor`

## Methods

### wrongNetwork()

> `static` **wrongNetwork**(`expectedChainId`, `actualChainId`): `NetworkError`

Defined in: [packages/core/src/errors.ts:125](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/core/src/errors.ts#L125)

Create error for wrong network

#### Parameters

##### expectedChainId

`number`

##### actualChainId

`number`

#### Returns

`NetworkError`

***

### connectionFailed()

> `static` **connectionFailed**(`reason`, `cause?`): `NetworkError`

Defined in: [packages/core/src/errors.ts:138](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/core/src/errors.ts#L138)

Create error for network connection issues

#### Parameters

##### reason

`string`

##### cause?

`unknown`

#### Returns

`NetworkError`

***

### unsupportedNetwork()

> `static` **unsupportedNetwork**(`chainId`): `NetworkError`

Defined in: [packages/core/src/errors.ts:149](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/core/src/errors.ts#L149)

Create error for unsupported network

#### Parameters

##### chainId

`number`

#### Returns

`NetworkError`

[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / CirclesError

# Class: CirclesError\<TSource\>

Defined in: [packages/utils/src/errors.ts:31](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L31)

Base Circles SDK Error
All SDK errors extend from this class

## Extends

- `Error`

## Extended by

- [`ContractError`](ContractError.md)
- [`ValidationError`](ValidationError.md)
- [`EncodingError`](EncodingError.md)

## Type Parameters

### TSource

`TSource` *extends* `string` = `string`

## Constructors

### Constructor

> **new CirclesError**\<`TSource`\>(`name`, `message`, `options?`): `CirclesError`\<`TSource`\>

Defined in: [packages/utils/src/errors.ts:38](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L38)

#### Parameters

##### name

`string`

##### message

`string`

##### options?

###### code?

`string` \| `number`

###### source?

`TSource`

###### cause?

`unknown`

###### context?

`Record`\<`string`, `any`\>

#### Returns

`CirclesError`\<`TSource`\>

#### Overrides

`Error.constructor`

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/utils/src/errors.ts:32](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L32)

#### Overrides

`Error.name`

***

### code?

> `readonly` `optional` **code**: `string` \| `number`

Defined in: [packages/utils/src/errors.ts:33](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L33)

***

### source

> `readonly` **source**: `TSource`

Defined in: [packages/utils/src/errors.ts:34](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L34)

***

### cause?

> `readonly` `optional` **cause**: `unknown`

Defined in: [packages/utils/src/errors.ts:35](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L35)

The cause of the error.

#### Overrides

`Error.cause`

***

### context?

> `readonly` `optional` **context**: `Record`\<`string`, `any`\>

Defined in: [packages/utils/src/errors.ts:36](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L36)

## Methods

### toJSON()

> **toJSON**(): `object`

Defined in: [packages/utils/src/errors.ts:64](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L64)

Convert error to JSON for logging/debugging

#### Returns

`object`

##### name

> **name**: `string`

##### message

> **message**: `string`

##### code

> **code**: `string` \| `number` \| `undefined`

##### source

> **source**: `TSource`

##### context

> **context**: `Record`\<`string`, `any`\> \| `undefined`

##### cause

> **cause**: `unknown`

##### stack

> **stack**: `string` \| `undefined`

***

### toString()

> **toString**(): `string`

Defined in: [packages/utils/src/errors.ts:82](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L82)

Get formatted error message with context

#### Returns

`string`

[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / ValidationError

# Class: ValidationError

Defined in: [packages/utils/src/errors.ts:97](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L97)

Validation errors

## Extends

- [`CirclesError`](CirclesError.md)\<[`UtilsErrorSource`](../type-aliases/UtilsErrorSource.md)\>

## Constructors

### Constructor

> **new ValidationError**(`message`, `options?`): `ValidationError`

Defined in: [packages/utils/src/errors.ts:98](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L98)

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

`ValidationError`

#### Overrides

[`CirclesError`](CirclesError.md).[`constructor`](CirclesError.md#constructor)

## Properties

### name

> `readonly` **name**: `string`

Defined in: [packages/utils/src/errors.ts:32](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L32)

#### Inherited from

[`CirclesError`](CirclesError.md).[`name`](CirclesError.md#name)

***

### code?

> `readonly` `optional` **code**: `string` \| `number`

Defined in: [packages/utils/src/errors.ts:33](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L33)

#### Inherited from

[`CirclesError`](CirclesError.md).[`code`](CirclesError.md#code)

***

### source

> `readonly` **source**: [`UtilsErrorSource`](../type-aliases/UtilsErrorSource.md)

Defined in: [packages/utils/src/errors.ts:34](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L34)

#### Inherited from

[`CirclesError`](CirclesError.md).[`source`](CirclesError.md#source)

***

### cause?

> `readonly` `optional` **cause**: `unknown`

Defined in: [packages/utils/src/errors.ts:35](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L35)

The cause of the error.

#### Inherited from

[`CirclesError`](CirclesError.md).[`cause`](CirclesError.md#cause)

***

### context?

> `readonly` `optional` **context**: `Record`\<`string`, `any`\>

Defined in: [packages/utils/src/errors.ts:36](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L36)

#### Inherited from

[`CirclesError`](CirclesError.md).[`context`](CirclesError.md#context)

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

> **source**: [`UtilsErrorSource`](../type-aliases/UtilsErrorSource.md)

##### context

> **context**: `Record`\<`string`, `any`\> \| `undefined`

##### cause

> **cause**: `unknown`

##### stack

> **stack**: `string` \| `undefined`

#### Inherited from

[`CirclesError`](CirclesError.md).[`toJSON`](CirclesError.md#tojson)

***

### toString()

> **toString**(): `string`

Defined in: [packages/utils/src/errors.ts:82](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L82)

Get formatted error message with context

#### Returns

`string`

#### Inherited from

[`CirclesError`](CirclesError.md).[`toString`](CirclesError.md#tostring)

***

### invalidAddress()

> `static` **invalidAddress**(`address`): `ValidationError`

Defined in: [packages/utils/src/errors.ts:113](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L113)

Create error for invalid address

#### Parameters

##### address

`string`

#### Returns

`ValidationError`

***

### invalidAmount()

> `static` **invalidAmount**(`amount`, `reason?`): `ValidationError`

Defined in: [packages/utils/src/errors.ts:123](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L123)

Create error for invalid amount

#### Parameters

##### amount

`any`

##### reason?

`string`

#### Returns

`ValidationError`

***

### missingParameter()

> `static` **missingParameter**(`paramName`): `ValidationError`

Defined in: [packages/utils/src/errors.ts:136](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L136)

Create error for missing parameter

#### Parameters

##### paramName

`string`

#### Returns

`ValidationError`

***

### invalidParameter()

> `static` **invalidParameter**(`paramName`, `value`, `reason?`): `ValidationError`

Defined in: [packages/utils/src/errors.ts:146](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/errors.ts#L146)

Create error for invalid parameter

#### Parameters

##### paramName

`string`

##### value

`any`

##### reason?

`string`

#### Returns

`ValidationError`

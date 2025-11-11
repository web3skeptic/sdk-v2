[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / ContractError

# Class: ContractError

Defined in: [packages/utils/src/contractErrors.ts:190](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/contractErrors.ts#L190)

Contract error class for Circles SDK
Extends CirclesError with contract-specific error information

## Extends

- [`CirclesError`](CirclesError.md)\<`"CORE"`\>

## Constructors

### Constructor

> **new ContractError**(`message`, `options?`): `ContractError`

Defined in: [packages/utils/src/contractErrors.ts:193](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/contractErrors.ts#L193)

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

###### decodedError?

[`DecodedContractError`](../../../types/src/interfaces/DecodedContractError.md)

#### Returns

`ContractError`

#### Overrides

[`CirclesError`](CirclesError.md).[`constructor`](CirclesError.md#constructor)

## Properties

### decodedError?

> `readonly` `optional` **decodedError**: [`DecodedContractError`](../../../types/src/interfaces/DecodedContractError.md)

Defined in: [packages/utils/src/contractErrors.ts:191](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/contractErrors.ts#L191)

***

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

> `readonly` **source**: `"CORE"`

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

### fromTransactionError()

> `static` **fromTransactionError**(`error`, `abi`, `context?`): `ContractError`

Defined in: [packages/utils/src/contractErrors.ts:209](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/contractErrors.ts#L209)

Create a ContractError from a transaction error

#### Parameters

##### error

`any`

##### abi

`Abi`

##### context?

`Record`\<`string`, `any`\>

#### Returns

`ContractError`

***

### toString()

> **toString**(): `string`

Defined in: [packages/utils/src/contractErrors.ts:246](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/contractErrors.ts#L246)

Get formatted error message with details

#### Returns

`string`

#### Overrides

[`CirclesError`](CirclesError.md).[`toString`](CirclesError.md#tostring)

***

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

> **source**: `"CORE"`

##### context

> **context**: `Record`\<`string`, `any`\> \| `undefined`

##### cause

> **cause**: `unknown`

##### stack

> **stack**: `string` \| `undefined`

#### Inherited from

[`CirclesError`](CirclesError.md).[`toJSON`](CirclesError.md#tojson)

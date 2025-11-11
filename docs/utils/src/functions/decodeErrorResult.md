[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / decodeErrorResult

# Function: decodeErrorResult()

> **decodeErrorResult**(`config`): \{ `errorName`: `string`; `args?`: `any`[]; \} \| `null`

Defined in: [packages/utils/src/abi.ts:568](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/abi.ts#L568)

Decode error data from a contract revert

## Parameters

### config

Configuration with ABI and error data

#### abi

`Abi`

#### data

`string`

## Returns

\{ `errorName`: `string`; `args?`: `any`[]; \} \| `null`

Decoded error with name and arguments

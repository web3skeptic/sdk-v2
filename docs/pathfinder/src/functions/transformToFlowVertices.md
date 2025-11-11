[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [pathfinder/src](../README.md) / transformToFlowVertices

# Function: transformToFlowVertices()

> **transformToFlowVertices**(`transfers`, `from`, `to`): `object`

Defined in: [packages/pathfinder/src/packing.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/pathfinder/src/packing.ts#L22)

Build a sorted vertex list plus index lookup for quick coordinate mapping.

## Parameters

### transfers

`TransferStep`[]

### from

`string`

### to

`string`

## Returns

`object`

### sorted

> **sorted**: `string`[]

### idx

> **idx**: `Record`\<`string`, `number`\>

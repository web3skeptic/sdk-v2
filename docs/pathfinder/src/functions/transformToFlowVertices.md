[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [pathfinder/src](../README.md) / transformToFlowVertices

# Function: transformToFlowVertices()

```ts
function transformToFlowVertices(
   transfers, 
   from, 
   to): object;
```

Defined in: [packages/pathfinder/src/packing.ts:22](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/pathfinder/src/packing.ts#L22)

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

```ts
sorted: string[];
```

### idx

```ts
idx: Record<string, number>;
```

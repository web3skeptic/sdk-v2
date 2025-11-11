[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / EventRow

# Interface: EventRow

Defined in: [packages/types/src/query.ts:91](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/query.ts#L91)

Defines the minimum columns any event row must have for cursor-based pagination.
These values are important for determining cursor position in result sets.

## Extended by

- [`Cursor`](Cursor.md)

## Properties

### blockNumber

```ts
blockNumber: number;
```

Defined in: [packages/types/src/query.ts:92](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/query.ts#L92)

***

### transactionIndex

```ts
transactionIndex: number;
```

Defined in: [packages/types/src/query.ts:93](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/query.ts#L93)

***

### logIndex

```ts
logIndex: number;
```

Defined in: [packages/types/src/query.ts:94](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/query.ts#L94)

***

### batchIndex?

```ts
optional batchIndex: number;
```

Defined in: [packages/types/src/query.ts:95](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/query.ts#L95)

***

### timestamp?

```ts
optional timestamp: number;
```

Defined in: [packages/types/src/query.ts:96](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/query.ts#L96)

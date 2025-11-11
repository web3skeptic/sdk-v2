[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / AdvancedTransferOptions

# Interface: AdvancedTransferOptions

Defined in: [packages/types/src/pathfinding.ts:87](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L87)

Advanced transfer options
Extends FindPathParams to add transfer-specific options

## Extends

- `Omit`\<[`FindPathParams`](FindPathParams.md), `"from"` \| `"to"` \| `"targetFlow"`\>

## Properties

### useWrappedBalances?

> `optional` **useWrappedBalances**: `boolean`

Defined in: [packages/types/src/pathfinding.ts:25](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L25)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`useWrappedBalances`](FindPathParams.md#usewrappedbalances)

***

### fromTokens?

> `optional` **fromTokens**: `` `0x${string}` ``[]

Defined in: [packages/types/src/pathfinding.ts:26](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L26)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`fromTokens`](FindPathParams.md#fromtokens)

***

### toTokens?

> `optional` **toTokens**: `` `0x${string}` ``[]

Defined in: [packages/types/src/pathfinding.ts:27](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L27)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`toTokens`](FindPathParams.md#totokens)

***

### excludeFromTokens?

> `optional` **excludeFromTokens**: `` `0x${string}` ``[]

Defined in: [packages/types/src/pathfinding.ts:28](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L28)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`excludeFromTokens`](FindPathParams.md#excludefromtokens)

***

### excludeToTokens?

> `optional` **excludeToTokens**: `` `0x${string}` ``[]

Defined in: [packages/types/src/pathfinding.ts:29](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L29)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`excludeToTokens`](FindPathParams.md#excludetotokens)

***

### simulatedBalances?

> `optional` **simulatedBalances**: [`SimulatedBalance`](SimulatedBalance.md)[]

Defined in: [packages/types/src/pathfinding.ts:30](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L30)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`simulatedBalances`](FindPathParams.md#simulatedbalances)

***

### maxTransfers?

> `optional` **maxTransfers**: `number`

Defined in: [packages/types/src/pathfinding.ts:31](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L31)

#### Inherited from

[`FindPathParams`](FindPathParams.md).[`maxTransfers`](FindPathParams.md#maxtransfers)

***

### txData?

> `optional` **txData**: `Uint8Array`\<`ArrayBufferLike`\>

Defined in: [packages/types/src/pathfinding.ts:91](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/pathfinding.ts#L91)

Custom data to attach to the transfer (optional)

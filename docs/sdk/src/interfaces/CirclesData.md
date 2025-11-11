[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [sdk/src](../README.md) / CirclesData

# Interface: CirclesData

Defined in: [packages/sdk/src/types.ts:13](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/types.ts#L13)

Circles data access layer
Provides read access to Circles protocol data

## Methods

### getAvatar()

> **getAvatar**(`address`): `Promise`\<`AvatarInfo` \| `undefined`\>

Defined in: [packages/sdk/src/types.ts:14](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/types.ts#L14)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<`AvatarInfo` \| `undefined`\>

***

### getTrustRelations()

> **getTrustRelations**(`address`): `Promise`\<`AggregatedTrustRelation`[]\>

Defined in: [packages/sdk/src/types.ts:15](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/types.ts#L15)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<`AggregatedTrustRelation`[]\>

***

### getBalances()

> **getBalances**(`address`): `Promise`\<`TokenBalance`[]\>

Defined in: [packages/sdk/src/types.ts:16](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/types.ts#L16)

#### Parameters

##### address

`` `0x${string}` ``

#### Returns

`Promise`\<`TokenBalance`[]\>

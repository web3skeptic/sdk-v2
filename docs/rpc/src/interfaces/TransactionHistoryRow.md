[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [rpc/src](../README.md) / TransactionHistoryRow

# Interface: TransactionHistoryRow

Defined in: [packages/rpc/src/types.ts:12](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L12)

Transaction history row (base data from RPC)
Might include conversions between different circle representations

## Properties

### blockNumber

> **blockNumber**: `number`

Defined in: [packages/rpc/src/types.ts:13](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L13)

***

### timestamp

> **timestamp**: `number`

Defined in: [packages/rpc/src/types.ts:14](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L14)

***

### transactionIndex

> **transactionIndex**: `number`

Defined in: [packages/rpc/src/types.ts:15](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L15)

***

### logIndex

> **logIndex**: `number`

Defined in: [packages/rpc/src/types.ts:16](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L16)

***

### transactionHash

> **transactionHash**: `string`

Defined in: [packages/rpc/src/types.ts:17](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L17)

***

### version

> **version**: `number`

Defined in: [packages/rpc/src/types.ts:18](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L18)

***

### from

> **from**: `` `0x${string}` ``

Defined in: [packages/rpc/src/types.ts:19](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L19)

***

### to

> **to**: `` `0x${string}` ``

Defined in: [packages/rpc/src/types.ts:20](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L20)

***

### id

> **id**: `string`

Defined in: [packages/rpc/src/types.ts:21](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L21)

***

### tokenAddress

> **tokenAddress**: `` `0x${string}` ``

Defined in: [packages/rpc/src/types.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L22)

***

### value

> **value**: `string`

Defined in: [packages/rpc/src/types.ts:23](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L23)

***

### circles?

> `optional` **circles**: `number`

Defined in: [packages/rpc/src/types.ts:25](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L25)

Human-readable circle amount (demurraged)

***

### attoCircles?

> `optional` **attoCircles**: `bigint`

Defined in: [packages/rpc/src/types.ts:27](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L27)

Atto-circles (demurraged, 18 decimals)

***

### staticCircles?

> `optional` **staticCircles**: `number`

Defined in: [packages/rpc/src/types.ts:29](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L29)

Static circles (inflationary, human-readable)

***

### staticAttoCircles?

> `optional` **staticAttoCircles**: `bigint`

Defined in: [packages/rpc/src/types.ts:31](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L31)

Atto-static circles (inflationary, 18 decimals)

***

### crc?

> `optional` **crc**: `number`

Defined in: [packages/rpc/src/types.ts:33](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L33)

Time Circles (CRC) human-readable

***

### attoCrc?

> `optional` **attoCrc**: `bigint`

Defined in: [packages/rpc/src/types.ts:35](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/types.ts#L35)

Atto-CRC (18 decimals)

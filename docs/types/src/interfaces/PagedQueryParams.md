[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / PagedQueryParams

# Interface: PagedQueryParams

Defined in: [packages/types/src/query.ts:142](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L142)

Parameters for a paginated query

## Properties

### namespace

> **namespace**: `string`

Defined in: [packages/types/src/query.ts:146](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L146)

The namespace of the table to query

***

### table

> **table**: `string`

Defined in: [packages/types/src/query.ts:150](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L150)

The name of the table to query

***

### sortOrder

> **sortOrder**: [`SortOrder`](../type-aliases/SortOrder.md)

Defined in: [packages/types/src/query.ts:154](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L154)

The order to sort the results

***

### columns

> **columns**: `string`[]

Defined in: [packages/types/src/query.ts:158](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L158)

The columns to return in the results

***

### filter?

> `optional` **filter**: [`Filter`](../type-aliases/Filter.md)[]

Defined in: [packages/types/src/query.ts:162](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L162)

The filters to apply to the query

***

### limit

> **limit**: `number`

Defined in: [packages/types/src/query.ts:166](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/types/src/query.ts#L166)

The number of results to return per page

[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [rpc/src](../README.md) / CirclesRpc

# Class: CirclesRpc

Defined in: [packages/rpc/src/rpc.ts:46](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L46)

Main RPC class for Circles protocol RPC interactions

## Example

```typescript
// Use default RPC endpoint
const rpc = new CirclesRpc();

// Use custom RPC endpoint
const rpc = new CirclesRpc('https://rpc.circlesubi.network/');

// Find a path
const path = await rpc.pathfinder.findPath({
  Source: '0x749c930256b47049cb65adcd7c25e72d5de44b3b',
  Sink: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
  TargetFlow: '99999999999999999999999999999999999'
});

// Query trust relations
const trustRelations = await rpc.query.query({
  Namespace: 'V_CrcV2',
  Table: 'TrustRelations',
  Columns: [],
  Filter: [],
  Order: []
});

// Get profile
const profile = await rpc.profile.getProfileByAddress('0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7');
```

## Constructors

### Constructor

> **new CirclesRpc**(`rpcUrl`): `CirclesRpc`

Defined in: [packages/rpc/src/rpc.ts:64](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L64)

Create a new CirclesRpc instance

#### Parameters

##### rpcUrl

`string` = `'https://rpc.circlesubi.network/'`

RPC URL to use (defaults to https://rpc.circlesubi.network/)

#### Returns

`CirclesRpc`

## Properties

### client

> `readonly` **client**: [`RpcClient`](RpcClient.md)

Defined in: [packages/rpc/src/rpc.ts:47](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L47)

***

### pathfinder

> `readonly` **pathfinder**: [`PathfinderMethods`](PathfinderMethods.md)

Defined in: [packages/rpc/src/rpc.ts:48](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L48)

***

### query

> `readonly` **query**: [`QueryMethods`](QueryMethods.md)

Defined in: [packages/rpc/src/rpc.ts:49](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L49)

***

### trust

> `readonly` **trust**: [`TrustMethods`](TrustMethods.md)

Defined in: [packages/rpc/src/rpc.ts:50](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L50)

***

### balance

> `readonly` **balance**: [`BalanceMethods`](BalanceMethods.md)

Defined in: [packages/rpc/src/rpc.ts:51](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L51)

***

### avatar

> `readonly` **avatar**: [`AvatarMethods`](AvatarMethods.md)

Defined in: [packages/rpc/src/rpc.ts:52](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L52)

***

### profile

> `readonly` **profile**: [`ProfileMethods`](ProfileMethods.md)

Defined in: [packages/rpc/src/rpc.ts:53](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L53)

***

### token

> `readonly` **token**: [`TokenMethods`](TokenMethods.md)

Defined in: [packages/rpc/src/rpc.ts:54](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L54)

***

### invitation

> `readonly` **invitation**: [`InvitationMethods`](InvitationMethods.md)

Defined in: [packages/rpc/src/rpc.ts:55](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L55)

***

### transaction

> `readonly` **transaction**: [`TransactionMethods`](TransactionMethods.md)

Defined in: [packages/rpc/src/rpc.ts:56](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L56)

***

### group

> `readonly` **group**: [`GroupMethods`](GroupMethods.md)

Defined in: [packages/rpc/src/rpc.ts:57](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L57)

## Methods

### setRpcUrl()

> **setRpcUrl**(`rpcUrl`): `void`

Defined in: [packages/rpc/src/rpc.ts:82](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L82)

Update the RPC URL

#### Parameters

##### rpcUrl

`string`

#### Returns

`void`

***

### getRpcUrl()

> **getRpcUrl**(): `string`

Defined in: [packages/rpc/src/rpc.ts:89](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/rpc.ts#L89)

Get the current RPC URL

#### Returns

`string`

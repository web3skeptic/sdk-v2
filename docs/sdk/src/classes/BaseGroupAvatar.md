[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [sdk/src](../README.md) / BaseGroupAvatar

# Class: BaseGroupAvatar

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L22)

BaseGroupAvatar class implementation
Provides a simplified wrapper around Circles protocol for base group avatars

This class represents a base group avatar in the Circles ecosystem and provides
methods for managing trust relationships, group properties, and metadata.

## Extends

- `CommonAvatar`

## Constructors

### Constructor

> **new BaseGroupAvatar**(`address`, `core`, `contractRunner?`, `avatarInfo?`): `BaseGroupAvatar`

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:25](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L25)

#### Parameters

##### address

`` `0x${string}` ``

##### core

`Core`

##### contractRunner?

`ContractRunner`

##### avatarInfo?

`AvatarRow`

#### Returns

`BaseGroupAvatar`

#### Overrides

`CommonAvatar.constructor`

## Properties

### balances

> `readonly` **balances**: `object`

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:44](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L44)

#### getTotal()

> **getTotal**: () => `Promise`\<`bigint`\>

##### Returns

`Promise`\<`bigint`\>

#### getTokenBalances()

> **getTokenBalances**: () => `Promise`\<`TokenBalanceRow`[]\>

##### Returns

`Promise`\<`TokenBalanceRow`[]\>

#### getTotalSupply()

> **getTotalSupply**: () => `Promise`\<`bigint`\>

Get total supply of this group's token

##### Returns

`Promise`\<`bigint`\>

#### Overrides

`CommonAvatar.balances`

***

### trust

> `readonly` **trust**: `object`

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:68](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L68)

#### add()

> **add**: (`avatar`, `expiry?`) => `Promise`\<`TransactionReceipt`\>

##### Parameters

###### avatar

`` `0x${string}` `` | `` `0x${string}` ``[]

###### expiry?

`bigint`

##### Returns

`Promise`\<`TransactionReceipt`\>

#### remove()

> **remove**: (`avatar`) => `Promise`\<`TransactionReceipt`\>

##### Parameters

###### avatar

`` `0x${string}` `` | `` `0x${string}` ``[]

##### Returns

`Promise`\<`TransactionReceipt`\>

#### isTrusting()

> **isTrusting**: (`otherAvatar`) => `Promise`\<`boolean`\>

##### Parameters

###### otherAvatar

`` `0x${string}` ``

##### Returns

`Promise`\<`boolean`\>

#### isTrustedBy()

> **isTrustedBy**: (`otherAvatar`) => `Promise`\<`boolean`\>

##### Parameters

###### otherAvatar

`` `0x${string}` ``

##### Returns

`Promise`\<`boolean`\>

#### getAll()

> **getAll**: () => `Promise`\<`AggregatedTrustRelation`[]\>

##### Returns

`Promise`\<`AggregatedTrustRelation`[]\>

#### addBatchWithConditions()

> **addBatchWithConditions**: (`members`, `expiry?`) => `Promise`\<`TransactionReceipt`\>

Trust a batch of members with membership condition checks

This is a group-specific method that validates members against membership conditions
before establishing trust.

##### Parameters

###### members

`` `0x${string}` ``[]

Array of member addresses

###### expiry?

`bigint`

Trust expiry timestamp. Defaults to 0

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction response

##### Example

```typescript
// Trust multiple members with condition checks
await groupAvatar.trust.addBatchWithConditions(
  ['0x123...', '0x456...', '0x789...'],
  BigInt(Date.now() / 1000 + 31536000) // 1 year expiry
);
```

#### Overrides

`CommonAvatar.trust`

***

### profile

> `readonly` **profile**: `object`

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:151](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L151)

#### get()

> **get**: () => `Promise`\<`Profile` \| `undefined`\>

##### Returns

`Promise`\<`Profile` \| `undefined`\>

#### update()

> **update**: (`profile`) => `Promise`\<`string`\>

##### Parameters

###### profile

`Profile`

##### Returns

`Promise`\<`string`\>

#### updateMetadata()

> **updateMetadata**: (`cid`) => `Promise`\<`TransactionReceipt`\>

##### Parameters

###### cid

`string`

##### Returns

`Promise`\<`TransactionReceipt`\>

#### registerShortName()

> **registerShortName**: (`nonce`) => `Promise`\<`TransactionReceipt`\>

##### Parameters

###### nonce

`number`

##### Returns

`Promise`\<`TransactionReceipt`\>

#### Overrides

`CommonAvatar.profile`

***

### properties

> `readonly` **properties**: `object`

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:214](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L214)

#### owner()

> **owner**: () => `Promise`\<`` `0x${string}` ``\>

Get the owner of this group

##### Returns

`Promise`\<`` `0x${string}` ``\>

#### mintHandler()

> **mintHandler**: () => `Promise`\<`` `0x${string}` ``\>

Get the mint handler address

##### Returns

`Promise`\<`` `0x${string}` ``\>

#### service()

> **service**: () => `Promise`\<`` `0x${string}` ``\>

Get the service address

##### Returns

`Promise`\<`` `0x${string}` ``\>

#### feeCollection()

> **feeCollection**: () => `Promise`\<`` `0x${string}` ``\>

Get the fee collection address

##### Returns

`Promise`\<`` `0x${string}` ``\>

#### getMembershipConditions()

> **getMembershipConditions**: () => `Promise`\<`` `0x${string}` ``[]\>

Get all membership conditions

##### Returns

`Promise`\<`` `0x${string}` ``[]\>

***

### setProperties

> `readonly` **setProperties**: `object`

Defined in: [packages/sdk/src/avatars/BaseGroupAvatar.ts:256](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/BaseGroupAvatar.ts#L256)

#### owner()

> **owner**: (`newOwner`) => `Promise`\<`TransactionReceipt`\>

Set a new owner for this group

##### Parameters

###### newOwner

`` `0x${string}` ``

##### Returns

`Promise`\<`TransactionReceipt`\>

#### service()

> **service**: (`newService`) => `Promise`\<`TransactionReceipt`\>

Set a new service address

##### Parameters

###### newService

`` `0x${string}` ``

##### Returns

`Promise`\<`TransactionReceipt`\>

#### feeCollection()

> **feeCollection**: (`newFeeCollection`) => `Promise`\<`TransactionReceipt`\>

Set a new fee collection address

##### Parameters

###### newFeeCollection

`` `0x${string}` ``

##### Returns

`Promise`\<`TransactionReceipt`\>

#### membershipCondition()

> **membershipCondition**: (`condition`, `enabled`) => `Promise`\<`TransactionReceipt`\>

Enable or disable a membership condition

##### Parameters

###### condition

`` `0x${string}` ``

###### enabled

`boolean`

##### Returns

`Promise`\<`TransactionReceipt`\>

***

### address

> `readonly` **address**: `` `0x${string}` ``

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:42](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L42)

#### Inherited from

`CommonAvatar.address`

***

### avatarInfo

> `readonly` **avatarInfo**: `AvatarRow` \| `undefined`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:43](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L43)

#### Inherited from

`CommonAvatar.avatarInfo`

***

### core

> `readonly` **core**: `Core`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:44](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L44)

#### Inherited from

`CommonAvatar.core`

***

### contractRunner?

> `readonly` `optional` **contractRunner**: `ContractRunner`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:45](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L45)

#### Inherited from

`CommonAvatar.contractRunner`

***

### events

> **events**: [`Observable`](../../../rpc/src/classes/Observable.md)\<`CirclesEvent`\>

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:46](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L46)

#### Inherited from

`CommonAvatar.events`

***

### runner

> `protected` `readonly` **runner**: `ContractRunner`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:48](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L48)

#### Inherited from

`CommonAvatar.runner`

***

### profiles

> `protected` `readonly` **profiles**: `Profiles`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:49](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L49)

#### Inherited from

`CommonAvatar.profiles`

***

### rpc

> `protected` `readonly` **rpc**: `CirclesRpc`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:50](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L50)

#### Inherited from

`CommonAvatar.rpc`

***

### transferBuilder

> `protected` `readonly` **transferBuilder**: `TransferBuilder`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:51](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L51)

#### Inherited from

`CommonAvatar.transferBuilder`

***

### \_cachedProfile?

> `protected` `optional` **\_cachedProfile**: `Profile`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:52](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L52)

#### Inherited from

`CommonAvatar._cachedProfile`

***

### \_cachedProfileCid?

> `protected` `optional` **\_cachedProfileCid**: `string`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:53](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L53)

#### Inherited from

`CommonAvatar._cachedProfileCid`

***

### \_eventSubscription()?

> `protected` `optional` **\_eventSubscription**: () => `void`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:54](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L54)

#### Returns

`void`

#### Inherited from

`CommonAvatar._eventSubscription`

***

### history

> `readonly` **history**: `object`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:405](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L405)

#### getTransactions()

> **getTransactions**: (`limit`, `sortOrder`) => `PagedQuery`\<`TransactionHistoryRow`\>

Get transaction history for this avatar using cursor-based pagination
Returns incoming/outgoing transactions and minting events

##### Parameters

###### limit

`number` = `50`

Number of transactions per page (default: 50)

###### sortOrder

Sort order for results (default: 'DESC')

`"ASC"` | `"DESC"`

##### Returns

`PagedQuery`\<`TransactionHistoryRow`\>

PagedQuery instance for iterating through transactions

##### Example

```typescript
const query = avatar.history.getTransactions(20);

// Get first page
await query.queryNextPage();
query.currentPage.results.forEach(tx => {
  console.log(`${tx.from} -> ${tx.to}: ${tx.circles} CRC`);
});

// Get next page if available
if (query.currentPage.hasMore) {
  await query.queryNextPage();
}
```

#### Inherited from

`CommonAvatar.history`

***

### transfer

> `readonly` **transfer**: `object`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:439](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L439)

#### direct()

> **direct**: (`to`, `amount`, `tokenAddress?`, `txData?`) => `Promise`\<`TransactionReceipt`\>

Send Circles tokens directly to another address
This is a simple direct transfer without pathfinding

Supports both ERC1155 (personal/group tokens) and ERC20 (wrapped tokens) transfers.
The token type is automatically detected and the appropriate transfer method is used.

For transfers using pathfinding (which can use trust network and multiple token types),
use transfer.advanced() instead.

##### Parameters

###### to

`` `0x${string}` ``

Recipient address

###### amount

`bigint`

Amount to transfer (in atto-circles)

###### tokenAddress?

`` `0x${string}` ``

Token address to transfer (defaults to sender's personal token)

###### txData?

`Uint8Array`\<`ArrayBufferLike`\>

Optional transaction data (only used for ERC1155 transfers)

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction receipt

##### Example

```typescript
// Send 100 of your personal CRC directly
const receipt = await avatar.transfer.direct('0x123...', BigInt(100e18));

// Send wrapped tokens
const receipt = await avatar.transfer.direct('0x123...', BigInt(100e18), '0xWrappedTokenAddress...');
```

#### advanced()

> **advanced**: (`to`, `amount`, `options?`) => `Promise`\<`TransactionReceipt`\>

Send tokens using pathfinding through the trust network
This enables transfers even when you don't have the recipient's token

##### Parameters

###### to

`` `0x${string}` ``

Recipient address

###### amount

Amount to transfer (in atto-circles or CRC)

`number` | `bigint`

###### options?

`AdvancedTransferOptions`

Advanced transfer options (pathfinding parameters)

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction receipt

##### Example

```typescript
// Send 100 CRC using pathfinding
await avatar.transfer.advanced('0x123...', BigInt(100e18));

// With custom options
await avatar.transfer.advanced('0x123...', 100, {
  maxTransfers: 5,
  maxDistance: 3
});
```

#### getMaxAmount()

> **getMaxAmount**: (`to`) => `Promise`\<`bigint`\>

Get the maximum amount that can be transferred to an address using pathfinding

##### Parameters

###### to

`` `0x${string}` ``

Recipient address

##### Returns

`Promise`\<`bigint`\>

Maximum transferable amount (in atto-circles)

##### Example

```typescript
const maxAmount = await avatar.transfer.getMaxAmount('0x123...');
console.log(`Can transfer up to: ${maxAmount}`);
```

#### getMaxAmountAdvanced()

> **getMaxAmountAdvanced**: (`to`, `options?`) => `Promise`\<`bigint`\>

Get the maximum amount that can be transferred with custom pathfinding options

##### Parameters

###### to

`` `0x${string}` ``

Recipient address

###### options?

[`PathfindingOptions`](../type-aliases/PathfindingOptions.md)

Pathfinding options (maxTransfers, maxDistance, etc.)

##### Returns

`Promise`\<`bigint`\>

Maximum transferable amount (in atto-circles)

##### Example

```typescript
const maxAmount = await avatar.transfer.getMaxAmountAdvanced('0x123...', {
  maxTransfers: 3,
  maxDistance: 2
});
```

#### Inherited from

`CommonAvatar.transfer`

***

### wrap

> `readonly` **wrap**: `object`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:599](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L599)

#### asDemurraged()

> **asDemurraged**: (`avatarAddress`, `amount`) => `Promise`\<`TransactionReceipt`\>

Wrap personal CRC tokens as demurraged ERC20 tokens

##### Parameters

###### avatarAddress

`` `0x${string}` ``

The avatar whose tokens to wrap

###### amount

`bigint`

Amount to wrap (in atto-circles)

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction receipt

##### Example

```typescript
// Wrap 100 CRC as demurraged ERC20
const receipt = await avatar.wrap.asDemurraged(avatar.address, BigInt(100e18));
```

#### asInflationary()

> **asInflationary**: (`avatarAddress`, `amount`) => `Promise`\<`TransactionReceipt`\>

Wrap personal CRC tokens as inflationary ERC20 tokens

##### Parameters

###### avatarAddress

`` `0x${string}` ``

The avatar whose tokens to wrap

###### amount

`bigint`

Amount to wrap (in atto-circles)

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction receipt

##### Example

```typescript
// Wrap 100 CRC as inflationary ERC20
const receipt = await avatar.wrap.asInflationary(avatar.address, BigInt(100e18));
```

#### unwrapDemurraged()

> **unwrapDemurraged**: (`tokenAddress`, `amount`) => `Promise`\<`TransactionReceipt`\>

Unwrap demurraged ERC20 tokens back to personal CRC

##### Parameters

###### tokenAddress

`` `0x${string}` ``

The demurraged token address to unwrap

###### amount

`bigint`

Amount to unwrap (in atto-circles)

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction receipt

##### Example

```typescript
const receipt = await avatar.wrap.unwrapDemurraged('0xTokenAddress...', BigInt(100e18));
```

#### unwrapInflationary()

> **unwrapInflationary**: (`tokenAddress`, `amount`) => `Promise`\<`TransactionReceipt`\>

Unwrap inflationary ERC20 tokens back to personal CRC

##### Parameters

###### tokenAddress

`` `0x${string}` ``

The inflationary token address to unwrap

###### amount

`bigint`

Amount to unwrap (in atto-circles)

##### Returns

`Promise`\<`TransactionReceipt`\>

Transaction receipt

##### Example

```typescript
const receipt = await avatar.wrap.unwrapInflationary('0xTokenAddress...', BigInt(100e18));
```

#### Inherited from

`CommonAvatar.wrap`

## Methods

### subscribeToEvents()

> **subscribeToEvents**(): `Promise`\<`void`\>

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:709](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L709)

Subscribe to Circles events for this avatar
Events are filtered to only include events related to this avatar's address

#### Returns

`Promise`\<`void`\>

Promise that resolves when subscription is established

#### Example

```typescript
await avatar.subscribeToEvents();

// Listen for events
avatar.events.subscribe((event) => {
  console.log('Event received:', event.$event, event);

  if (event.$event === 'CrcV2_PersonalMint') {
    console.log('Minted:', event.amount);
  }
});
```

#### Inherited from

`CommonAvatar.subscribeToEvents`

***

### unsubscribeFromEvents()

> **unsubscribeFromEvents**(): `void`

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:719](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L719)

Unsubscribe from events
Cleans up the WebSocket connection and event listeners

#### Returns

`void`

#### Inherited from

`CommonAvatar.unsubscribeFromEvents`

***

### \_transferErc1155()

> `protected` **\_transferErc1155**(`tokenAddress`, `to`, `amount`, `txData?`): `Promise`\<`TransactionReceipt`\>

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:734](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L734)

Transfer ERC1155 tokens using safeTransferFrom

#### Parameters

##### tokenAddress

`` `0x${string}` ``

##### to

`` `0x${string}` ``

##### amount

`bigint`

##### txData?

`Uint8Array`\<`ArrayBufferLike`\>

#### Returns

`Promise`\<`TransactionReceipt`\>

#### Inherited from

`CommonAvatar._transferErc1155`

***

### \_transferErc20()

> `protected` **\_transferErc20**(`to`, `amount`, `tokenAddress`): `Promise`\<`TransactionReceipt`\>

Defined in: [packages/sdk/src/avatars/CommonAvatar.ts:763](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/avatars/CommonAvatar.ts#L763)

Transfer ERC20 tokens using the standard transfer function

#### Parameters

##### to

`` `0x${string}` ``

##### amount

`bigint`

##### tokenAddress

`` `0x${string}` ``

#### Returns

`Promise`\<`TransactionReceipt`\>

#### Inherited from

`CommonAvatar._transferErc20`

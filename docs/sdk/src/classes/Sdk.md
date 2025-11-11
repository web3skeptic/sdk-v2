[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [sdk/src](../README.md) / Sdk

# Class: Sdk

Defined in: [packages/sdk/src/Sdk.ts:50](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L50)

Simplified Circles SDK
Provides a user-friendly API for non-crypto users with low entrance barrier

## Example

```typescript
const sdk = new Sdk();

// Register as a human
const avatar = await sdk.register.asHuman('0xInviterAddress', {
  name: 'Alice',
  description: 'Developer'
});

// Get an avatar
const avatar = await sdk.getAvatar('0xAvatarAddress');

// Transfer tokens
await avatar.transfer.direct('0xRecipient', 100);

// Mint personal tokens
await avatar.personalToken.mint();
```

## Constructors

### Constructor

> **new Sdk**(`config`, `contractRunner?`): `Sdk`

Defined in: [packages/sdk/src/Sdk.ts:77](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L77)

Create a new Sdk instance

#### Parameters

##### config

`CirclesConfig` = `...`

Circles configuration (defaults to Gnosis Chain mainnet)

##### contractRunner?

`ContractRunner`

Optional contract runner for executing transactions

#### Returns

`Sdk`

#### Throws

Error if contractRunner is provided but doesn't support sendTransaction or has no address

## Properties

### circlesConfig

> `readonly` **circlesConfig**: `CirclesConfig`

Defined in: [packages/sdk/src/Sdk.ts:51](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L51)

***

### contractRunner?

> `readonly` `optional` **contractRunner**: `ContractRunner`

Defined in: [packages/sdk/src/Sdk.ts:52](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L52)

***

### senderAddress?

> `readonly` `optional` **senderAddress**: `` `0x${string}` ``

Defined in: [packages/sdk/src/Sdk.ts:53](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L53)

***

### core

> `readonly` **core**: `Core`

Defined in: [packages/sdk/src/Sdk.ts:54](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L54)

***

### rpc

> `readonly` **rpc**: `CirclesRpc`

Defined in: [packages/sdk/src/Sdk.ts:55](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L55)

***

### data

> `readonly` **data**: [`CirclesData`](../interfaces/CirclesData.md)

Defined in: [packages/sdk/src/Sdk.ts:58](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L58)

***

### register

> `readonly` **register**: `object`

Defined in: [packages/sdk/src/Sdk.ts:129](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L129)

Registration methods for creating new Circles identities

#### asHuman()

> **asHuman**: (`inviter`, `profile`) => `Promise`\<[`HumanAvatar`](HumanAvatar.md)\>

Register as a human in the Circles ecosystem

This function:
1. Checks for pending invitations from inviters in the InvitationEscrow
2. If invitations exist, redeems one to claim escrowed tokens
3. Otherwise, checks if the specified inviter has enough unwrapped CRC
4. Creates and uploads profile data to IPFS
5. Registers the human with the profile CID
6. Returns a HumanAvatar instance for the registered account

Requirements:
- Contract runner must be configured to execute transactions
- Either: pending invitations from inviters, OR inviter has 96+ CRC unwrapped

##### Parameters

###### inviter

`` `0x${string}` ``

Address of the inviting avatar (fallback if no invitations found)

###### profile

Profile data with name, description, etc.

`string` | `Profile`

##### Returns

`Promise`\<[`HumanAvatar`](HumanAvatar.md)\>

HumanAvatar instance for the newly registered human

##### Example

```typescript
const avatar = await sdk.register.asHuman('0xInviter', {
  name: 'Alice',
  description: 'Developer'
});
```

#### asOrganization()

> **asOrganization**: (`profile`) => `Promise`\<[`OrganisationAvatar`](OrganisationAvatar.md)\>

Register as an organization
Organizations can participate in Circles without minting personal tokens
and do not require invitations to register

##### Parameters

###### profile

Profile data for the organization or CID string

`string` | `Profile`

##### Returns

`Promise`\<[`OrganisationAvatar`](OrganisationAvatar.md)\>

OrganisationAvatar instance for the newly registered organization

##### Example

```typescript
const orgAvatar = await sdk.register.asOrganization({
  name: 'My Organization',
  description: 'A Circles organization'
});
```

#### asGroup()

> **asGroup**: (`owner`, `service`, `feeCollection`, `initialConditions`, `name`, `symbol`, `profile`) => `Promise`\<[`BaseGroupAvatar`](BaseGroupAvatar.md)\>

Register a base group
Creates a new base group using the BaseGroupFactory and registers it in the Circles ecosystem

##### Parameters

###### owner

`` `0x${string}` ``

The address that will own the newly created BaseGroup

###### service

`` `0x${string}` ``

The address of the service for the new BaseGroup

###### feeCollection

`` `0x${string}` ``

The address of the fee collection for the new BaseGroup

###### initialConditions

`` `0x${string}` ``[]

An array of initial condition addresses

###### name

`string`

The group name (must be 19 characters or fewer)

###### symbol

`string`

The group symbol (e.g., 'MYG')

###### profile

Profile data (name, description, images, etc.) or CID string

`string` | `Profile`

##### Returns

`Promise`\<[`BaseGroupAvatar`](BaseGroupAvatar.md)\>

BaseGroupAvatar instance for the newly registered group

##### Example

```typescript
const groupAvatar = await sdk.register.asGroup(
  '0xOwnerAddress',
  '0xServiceAddress',
  '0xFeeCollectionAddress',
  [], // initial conditions
  'My Group', // name
  'MYG', // symbol
  {
    name: 'My Group',
    description: 'A Circles base group'
  }
);
```

***

### profiles

> `readonly` **profiles**: `object`

Defined in: [packages/sdk/src/Sdk.ts:426](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L426)

Profile management methods

#### create()

> **create**: (`profile`) => `Promise`\<`string`\>

Create and pin a profile to IPFS

##### Parameters

###### profile

`Profile`

Profile data or CID string

##### Returns

`Promise`\<`string`\>

CID of the pinned profile

#### get()

> **get**: (`cid`) => `Promise`\<`Profile` \| `undefined`\>

Get a profile by CID

##### Parameters

###### cid

`string`

Content identifier

##### Returns

`Promise`\<`Profile` \| `undefined`\>

Profile data or undefined if not found

***

### tokens

> `readonly` **tokens**: `object`

Defined in: [packages/sdk/src/Sdk.ts:449](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L449)

Token utilities

#### getInflationaryWrapper()

> **getInflationaryWrapper**: (`address`) => `Promise`\<`` `0x${string}` ``\>

Get an inflationary wrapper for a token

##### Parameters

###### address

`` `0x${string}` ``

Avatar address

##### Returns

`Promise`\<`` `0x${string}` ``\>

The ERC20 inflationary wrapper address, or zero address if not deployed

#### getDemurragedWrapper()

> **getDemurragedWrapper**: (`address`) => `Promise`\<`` `0x${string}` ``\>

Get a demurraged wrapper for a token

##### Parameters

###### address

`` `0x${string}` ``

Avatar address

##### Returns

`Promise`\<`` `0x${string}` ``\>

The ERC20 demurraged wrapper address, or zero address if not deployed

#### getHolders()

> **getHolders**: (`tokenAddress`, `limit`, `sortOrder`) => `PagedQuery`\<`TokenHolder`\>

Get token holders for a specific token address with pagination

##### Parameters

###### tokenAddress

`` `0x${string}` ``

The token address to query holders for

###### limit

`number` = `100`

Maximum number of results per page (default: 100)

###### sortOrder

`SortOrder` = `'DESC'`

Sort order for results (default: 'DESC' - highest balance first)

##### Returns

`PagedQuery`\<`TokenHolder`\>

PagedQuery instance for token holders

##### Example

```typescript
const holdersQuery = sdk.tokens.getHolders('0x42cedde51198d1773590311e2a340dc06b24cb37', 10);

while (await holdersQuery.queryNextPage()) {
  const page = holdersQuery.currentPage!;
  console.log(`Found ${page.size} holders`);
  page.results.forEach(holder => {
    console.log(`${holder.account}: ${holder.demurragedTotalBalance}`);
  });
}
```

***

### groups

> `readonly` **groups**: `object`

Defined in: [packages/sdk/src/Sdk.ts:500](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L500)

Group utilities

#### getType()

> **getType**: (`avatar`) => `Promise`\<`GroupType` \| `undefined`\>

Get the type of a group

##### Parameters

###### avatar

`` `0x${string}` ``

Group avatar address

##### Returns

`Promise`\<`GroupType` \| `undefined`\>

Group type or undefined if not a group

#### getMembers()

> **getMembers**: (`groupAddress`, `limit`, `sortOrder`) => `PagedQuery`\<`GroupMembershipRow`\>

Get all members of a specific group using cursor-based pagination

Returns a PagedQuery instance for iterating through members of the specified group,
including membership details such as expiry time and when the membership was created.

##### Parameters

###### groupAddress

`` `0x${string}` ``

The address of the group to query members for

###### limit

`number` = `100`

Number of members per page (default: 100)

###### sortOrder

Sort order for results (default: 'DESC')

`"ASC"` | `"DESC"`

##### Returns

`PagedQuery`\<`GroupMembershipRow`\>

PagedQuery instance for iterating through group members

##### Example

```typescript
const query = sdk.groups.getMembers('0xGroupAddress...');

// Get first page
await query.queryNextPage();
console.log(`${query.currentPage.size} members in the group`);

// Iterate through all members
while (await query.queryNextPage()) {
  query.currentPage.results.forEach(membership => {
    console.log(`Member: ${membership.member}`);
    console.log(`Expiry: ${new Date(membership.expiryTime * 1000).toLocaleDateString()}`);
  });
}
```

#### getCollateral()

> **getCollateral**: (`groupAddress`) => `Promise`\<`TokenBalance`[]\>

Get collateral tokens in a group's treasury

This convenience method fetches the treasury address of a group and returns
all token balances held in the treasury.

##### Parameters

###### groupAddress

`` `0x${string}` ``

The address of the group

##### Returns

`Promise`\<`TokenBalance`[]\>

Array of token balances in the treasury

##### Example

```typescript
// Get collateral tokens in a group treasury
const collateral = await sdk.groups.getCollateral('0xGroupAddress...');

collateral.forEach(balance => {
  console.log(`Token: ${balance.tokenAddress}`);
  console.log(`Balance: ${balance.circles} CRC`);
});
```

#### getHolders()

> **getHolders**: (`groupAddress`, `limit`) => `PagedQuery`\<`GroupTokenHolderRow`\>

Get all holders of a group token using cursor-based pagination

Returns all avatars that hold the specified group token, ordered by balance (highest first),
including balance amounts and ownership fractions.

##### Parameters

###### groupAddress

`` `0x${string}` ``

The address of the group token

###### limit

`number` = `100`

Maximum number of holders to return (default: 100)

##### Returns

`PagedQuery`\<`GroupTokenHolderRow`\>

PagedQuery instance for iterating through group token holders

##### Example

```typescript
// Get all holders of a group token
const query = sdk.groups.getHolders('0xGroupAddress...');

// Get first page (ordered by balance DESC)
await query.queryNextPage();
console.log(`${query.currentPage.size} holders of this group token`);

// Iterate through all holders
while (await query.queryNextPage()) {
  query.currentPage.results.forEach(holder => {
    const balanceInCrc = Number(holder.totalBalance) / 1e18;
    console.log(`Holder: ${holder.holder}`);
    console.log(`Balance: ${balanceInCrc.toFixed(2)} CRC`);
    console.log(`Ownership: ${(holder.fractionOwnership * 100).toFixed(2)}%`);
  });
}
```

## Methods

### getAvatar()

> **getAvatar**(`avatarAddress`): `Promise`\<[`HumanAvatar`](HumanAvatar.md) \| [`OrganisationAvatar`](OrganisationAvatar.md) \| [`BaseGroupAvatar`](BaseGroupAvatar.md)\>

Defined in: [packages/sdk/src/Sdk.ts:104](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/Sdk.ts#L104)

Get an avatar by address
Automatically detects the avatar type and returns the appropriate avatar instance

#### Parameters

##### avatarAddress

`` `0x${string}` ``

#### Returns

`Promise`\<[`HumanAvatar`](HumanAvatar.md) \| [`OrganisationAvatar`](OrganisationAvatar.md) \| [`BaseGroupAvatar`](BaseGroupAvatar.md)\>

HumanAvatar, OrganisationAvatar, or BaseGroupAvatar depending on type

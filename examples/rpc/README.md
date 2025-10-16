# Circles RPC Examples

This directory contains comprehensive examples demonstrating how to use the Circles RPC SDK.

All examples use the test address: `0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b`

## Running Examples

```bash
# From the repository root
cd examples/rpc

# Run any example with bun
bun run 01-basic-rpc.ts
bun run 08-trust-relations.ts
# etc.
```

## Available Examples

### Basic Examples

#### 01-basic-rpc.ts
Introduction to the Circles RPC client - connecting and making basic calls.

#### 02-circlesv2-balance-and-pathfinding.ts
Demonstrates balance queries and pathfinding for V2 Circles.

#### 03-query-examples.ts
Low-level query examples using the generic `circles_query` method.

#### 04-trust-examples.ts
Basic trust relation queries.

#### 05-balance-examples.ts
Querying token balances and total balances.

#### 06-avatar-examples.ts
Fetching avatar information and network snapshots.

#### 07-profile-examples.ts
Working with user profiles and metadata.

---

### New Advanced Examples

#### 08-trust-relations.ts
**Comprehensive trust relation queries**

Learn how to:
- Get all v2 trust relations for an address
- Get aggregated trust relations (categorized by type)
- Filter by incoming trust (who trusts this avatar)
- Filter by outgoing trust (who this avatar trusts)
- Find mutual trust connections
- Get common trust between two addresses

Example output:
```typescript
const aggregated = await rpc.trust.getAggregatedTrustRelations(address);
// Returns relations categorized as:
// - 'mutuallyTrusts': both parties trust each other
// - 'trusts': outgoing trust from this address
// - 'trustedBy': incoming trust to this address
```

---

#### 09-transaction-history.ts
**Transaction history and activity analysis**

Learn how to:
- Query transaction history with pagination
- Analyze transaction types (incoming/outgoing/minting)
- Filter by Circles version (v1/v2)
- Get unique tokens involved in transactions
- Display transaction timelines

Example output:
```typescript
const history = await rpc.transaction.getTransactionHistory(address, 50);
// Returns detailed transaction information including:
// - from/to addresses
// - token address
// - value transferred
// - timestamp and block info
```

---

#### 10-group-queries.ts
**Group discovery and membership queries**

Learn how to:
- Find all groups with pagination
- Search groups by name prefix
- Search groups by symbol prefix
- Find groups by owner address
- Query group memberships for an address
- Filter groups by type
- Sort groups by member count

Example queries:
```typescript
// Find groups by name
const groups = await rpc.group.findGroups(50, {
  nameStartsWith: 'Community'
});

// Get memberships
const memberships = await rpc.group.getGroupMemberships(address, 20);
```

---

#### 11-invitation-queries.ts
**Invitation tracking and management**

Learn how to:
- Find who invited an address
- Get available inviters for an address
- List accepted invitations sent by an address
- List pending invitations sent by an address
- Check invitation eligibility and balance requirements
- Calculate invitation statistics

Example workflow:
```typescript
// Check who invited this address
const inviter = await rpc.invitation.getInvitedBy(address);

// Get accepted invitations
const accepted = await rpc.invitation.getInvitationsFrom(address, true);

// Get pending invitations
const pending = await rpc.invitation.getInvitationsFrom(address, false);

// Check if address can invite (needs to be human + have 96 CRC)
const invitations = await rpc.invitation.getInvitations(address);
```

---

#### 12-comprehensive-profile.ts
**Complete profile view combining all RPC methods**

This example demonstrates how to build a comprehensive profile view by combining multiple RPC queries:

- **Basic Information**: Avatar type, registration date, version
- **Profile**: Name, description, image, location
- **Balances**: Total balance and token breakdown
- **Trust Network**: Mutual trusts, incoming/outgoing trust counts
- **Recent Activity**: Transaction history analysis
- **Groups**: Group memberships
- **Invitations**: Invitation statistics

This is a great reference for building wallet UIs or profile pages.

---

## RPC Methods Reference

### Trust Methods
```typescript
rpc.trust.getTrustRelations(avatar)              // Get all v2 trust relations
rpc.trust.getAggregatedTrustRelations(avatar)    // Get categorized trust relations
rpc.trust.getTrustedBy(avatar)                   // Get incoming trust
rpc.trust.getTrusts(avatar)                      // Get outgoing trust
rpc.trust.getMutualTrusts(avatar)                // Get mutual trusts
rpc.trust.getCommonTrust(address1, address2)     // Get common trusted addresses
```

### Transaction Methods
```typescript
rpc.transaction.getTransactionHistory(avatar, limit)  // Get transaction history
```

### Group Methods
```typescript
rpc.group.findGroups(limit, params?)             // Search for groups
rpc.group.getGroupMemberships(avatar, limit)     // Get group memberships
```

### Invitation Methods
```typescript
rpc.invitation.getInvitedBy(address)             // Get inviter address
rpc.invitation.getInvitations(address)           // Get available inviters
rpc.invitation.getInvitationsFrom(address, accepted)  // Get sent invitations
```

### Avatar Methods
```typescript
rpc.avatar.getAvatarInfo(address)                // Get avatar information
rpc.avatar.getAvatarInfoBatch(addresses)         // Batch get avatar info
rpc.avatar.getNetworkSnapshot()                  // Get network snapshot
```

### Balance Methods
```typescript
rpc.balance.getTotalBalance(address, asTimeCircles)   // Get total v2 balance
rpc.balance.getTokenBalances(address)                 // Get detailed token balances
```

### Profile Methods
```typescript
rpc.profile.getProfileByAddress(address)         // Get profile by address
rpc.profile.getProfileByAddressBatch(addresses)  // Batch get profiles
rpc.profile.getProfileByCid(cid)                 // Get profile by CID
rpc.profile.searchProfiles(query, limit, offset) // Search profiles
```

### Token Methods
```typescript
rpc.token.getTokenInfo(address)                  // Get token information
rpc.token.getTokenInfoBatch(addresses)           // Batch get token info
```

### Query Methods
```typescript
rpc.query.query(params)                          // Generic query method
rpc.query.tables()                               // Get available tables
rpc.query.events(fromBlock, toBlock, types)      // Query events
```

## Network Endpoints

- **Gnosis Mainnet**: `https://rpc.circlesubi.id`
- **Chiado Testnet**: `https://rpc.helsinki.circlesubi.id`

## TypeScript Support

All RPC methods are fully typed. Import types from `@circles-sdk/types`:

```typescript
import type {
  Address,
  AvatarInfo,
  TokenBalance,
  TrustRelation,
  TransactionHistoryRow,
  GroupRow,
  GroupMembershipRow,
} from '@circles-sdk/types';
```

## Error Handling

Always wrap RPC calls in try-catch blocks:

```typescript
try {
  const balance = await rpc.balance.getTotalBalance(address);
  console.log('Balance:', balance);
} catch (error) {
  console.error('Error fetching balance:', error);
}
```

## Performance Tips

1. **Batch Requests**: Use batch methods when querying multiple addresses
2. **Pagination**: Use limit parameters to avoid large responses
3. **Caching**: Cache avatar info and profiles as they change infrequently
4. **Parallel Queries**: Use `Promise.all()` for independent queries

Example:
```typescript
const [avatar, balance, trusts] = await Promise.all([
  rpc.avatar.getAvatarInfo(address),
  rpc.balance.getTotalBalance(address),
  rpc.trust.getMutualTrusts(address)
]);
```

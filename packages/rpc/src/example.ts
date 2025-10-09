import { CirclesRpc } from './index';

/**
 * Example usage of the Circles RPC SDK
 *
 * This demonstrates:
 * - CirclesV2 methods (balance, pathfinding)
 * - Query methods (tables, events, custom queries)
 * - Trust methods
 * - Balance methods
 * - Avatar methods
 * - Profile methods
 */

// Example 1: Create RPC instance with default endpoint
const rpc = new CirclesRpc('https://rpc.circlesubi.network/');

console.log('Using RPC:', rpc.getRpcUrl());

// Example 2: Get total v2 Circles balance
async function exampleGetTotalBalance() {
  const balance = await rpc.circlesV2.getTotalBalance(
    '0xcadd4ea3bcc361fc4af2387937d7417be8d7dfc2'
  );
  console.log('Total V2 Balance:', balance);
}

// Example 3: Find a path between two addresses
async function exampleFindPath() {
  const path = await rpc.circlesV2.findPath({
    from: '0x749c930256b47049cb65adcd7c25e72d5de44b3b',
    to: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
    targetFlow: 99999999999999999999999999999999999n
  });
  console.log('Path found:', path);
}

// Example 4: Find a circular path (token swap)
async function exampleCircularPath() {
  const path = await rpc.circlesV2.findPath({
    from: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
    to: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
    targetFlow: 100000000000000000000n,
    fromTokens: ['0x86533d1aDA8Ffbe7b6F7244F9A1b707f7f3e239b'],
    toTokens: ['0x6B69683C8897e3d18e74B1Ba117b49f80423Da5d'],
    simulatedBalances: [{
      holder: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
      token: '0x86533d1aDA8Ffbe7b6F7244F9A1b707f7f3e239b',
      amount: 100000000000000000000n,
      isWrapped: false
    }]
  });
  console.log('Circular path found:', path);
}

// Example 5: Query trust relations
async function exampleQueryTrustRelations() {
  const trustRelations = await rpc.query.query({
    Namespace: 'V_CrcV2',
    Table: 'TrustRelations',
    Columns: [],
    Filter: [{
      Type: 'Conjunction',
      ConjunctionType: 'Or',
      Predicates: [
        {
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'truster',
          Value: '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b'
        },
        {
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'trustee',
          Value: '0xA6247834B41771022498F63CAE8820fFEE208265'
        }
      ]
    }],
    Order: []
  });
  console.log('Trust relations:', trustRelations);
}

// Example 6: Get available tables
async function exampleGetTables() {
  const tables = await rpc.query.tables();
  console.log('Available tables:', tables);
}

// Example 7: Query events
async function exampleQueryEvents() {
  const events = await rpc.query.events(
    38000000,
    null,
    ['CrcV1_Trust'],
    null,
    false
  );
  console.log('Trust events:', events);
}

// Example 8: Query token information
async function exampleQueryTokenInfo() {
  const tokenInfo = await rpc.query.query({
    Namespace: 'V_Crc',
    Table: 'Tokens',
    Columns: [
      'blockNumber',
      'timestamp',
      'transactionIndex',
      'logIndex',
      'transactionHash',
      'version',
      'type',
      'token',
      'tokenOwner'
    ],
    Filter: [{
      Type: 'FilterPredicate',
      FilterType: 'Equals',
      Column: 'token',
      Value: '0x0d8c4901dd270fe101b8014a5dbecc4e4432eb1e'
    }],
    Order: []
  });
  console.log('Token info:', tokenInfo);
}

// Example 9: Query token holders
async function exampleQueryTokenHolders() {
  const holders = await rpc.query.query({
    Namespace: 'V_CrcV2',
    Table: 'BalancesByAccountAndToken',
    Columns: [],
    Filter: [{
      Type: 'FilterPredicate',
      FilterType: 'Equals',
      Column: 'tokenAddress',
      Value: '0x42cedde51198d1773590311e2a340dc06b24cb37'
    }],
    Order: [{
      Column: 'demurragedTotalBalance',
      SortOrder: 'DESC'
    }]
  });
  console.log('Token holders:', holders);
}

// Example 10: Get common trust
async function exampleGetCommonTrust() {
  const commonTrust = await rpc.trust.getCommonTrust(
    '0xde374ece6fa50e781e81aac78e811b33d16912c7',
    '0xe8fc7a2d0573e5164597b05f14fa9a7fca7b215c'
  );
  console.log('Common trust:', commonTrust);
}

// Example 11: Get token balances
async function exampleGetTokenBalances() {
  const balances = await rpc.balance.getTokenBalances(
    '0xA6247834B41771022498F63CAE8820fFEE208265'
  );
  console.log('Token balances:', balances);
}

// Example 12: Get avatar info
async function exampleGetAvatarInfo() {
  const avatarInfo = await rpc.avatar.getAvatarInfo(
    '0xA6247834B41771022498F63CAE8820fFEE208265'
  );

  console.log('Avatar info:', avatarInfo);
}

// Example 13: Get network snapshot
async function exampleGetNetworkSnapshot() {
  const snapshot = await rpc.avatar.getNetworkSnapshot();
  console.log('Network snapshot:', {
    trustRelationsCount: snapshot.trustRelations.length,
    balancesCount: snapshot.balances.length,
    blockNumber: snapshot.blockNumber,
    timestamp: snapshot.timestamp
  });
}

// Example 14: Get profile by CID
async function exampleGetProfileByCid() {
  const profile = await rpc.profile.getProfileByCid(
    'Qmb2s3hjxXXcFqWvDDSPCd1fXXa9gcFJd8bzdZNNAvkq9W'
  );
  console.log('Profile by CID:', profile);
}

// Example 15: Get profiles by CID batch
async function exampleGetProfileByCidBatch() {
  const profiles = await rpc.profile.getProfileByCidBatch([
    'Qmb2s3hjxXXcFqWvDDSPCd1fXXa9gcFJd8bzdZNNAvkq9W',
    null,
    'QmZuR1Jkhs9RLXVY28eTTRSnqbxLTBSoggp18Yde858xCM',
    'QmanRNbDjbiSFdxcYT9S9wpk3gaCVnM81MVAHkmJj6AqE5'
  ]);
  console.log('Profiles by CID batch:', profiles);
}

// Example 16: Get profile by address
async function exampleGetProfileByAddress() {
  const profile = await rpc.profile.getProfileByAddress(
    '0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7'
  );
  console.log('Profile by address:', profile);
}

// Example 17: Get profiles by address batch
async function exampleGetProfileByAddressBatch() {
  const profiles = await rpc.profile.getProfileByAddressBatch([
    '0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7',
    '0xf712d3b31de494b5c0ea51a6a407460ca66b12e8',
    null,
    '0xde374ece6fa50e781e81aac78e811b33D16912C7'
  ]);
  console.log('Profiles by address batch:', profiles);
}

// Example 18: Search profiles
async function exampleSearchProfiles() {
  const results = await rpc.profile.searchProfiles(
    '0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7',
    10,
    0
  );
  console.log('Profile search results:', results);
}

// Example 19: Use a different RPC endpoint
const rpcAlternative = new CirclesRpc('https://rpc.aboutcircles.com/');
console.log('Alternative RPC:', rpcAlternative.getRpcUrl());

// Example 20: Change RPC URL dynamically
rpc.setRpcUrl('https://rpc.aboutcircles.com/');
console.log('Updated RPC:', rpc.getRpcUrl());

// Run examples (uncomment to execute)
// exampleGetTotalBalance();
// exampleFindPath();
// exampleCircularPath();
// exampleQueryTrustRelations();
// exampleGetTables();
// exampleQueryEvents();
// exampleQueryTokenInfo();
// exampleQueryTokenHolders();
// exampleGetCommonTrust();
exampleGetTokenBalances();
// exampleGetAvatarInfo();
// exampleGetNetworkSnapshot();
// exampleGetProfileByCid();
// exampleGetProfileByCidBatch();
// exampleGetProfileByAddress();
// exampleGetProfileByAddressBatch();
// exampleSearchProfiles();

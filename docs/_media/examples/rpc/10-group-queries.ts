/**
 * Group Query Examples
 *
 * Demonstrates how to query groups and group memberships
 */

import { CirclesRpc } from '@aboutcircles/sdk-rpc';

const TEST_ADDRESS = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';

async function main() {
  const rpc = new CirclesRpc();

  console.log('=== Group Query Examples ===\n');
  console.log(`Test Address: ${TEST_ADDRESS}\n`);

  // 1. Find all groups
  console.log('1. Finding all groups (limit 10)...');
  const allGroups = await rpc.group.findGroups(10);
  console.log(`Found ${allGroups.length} groups`);
  if (allGroups.length > 0) {
    console.log('First group:', {
      address: allGroups[0].group,
      name: allGroups[0].name,
      symbol: allGroups[0].symbol,
      owner: allGroups[0].owner,
      memberCount: allGroups[0].memberCount,
      type: allGroups[0].type,
    });
  }
  console.log();

  // 2. Find groups by name prefix
  console.log('2. Finding groups by name prefix "Metri"...');
  try {
    const communityGroups = await rpc.group.findGroups(10, {
      nameStartsWith: 'Metri',
    });
    console.log(`Found ${communityGroups.length} groups with name starting with "Metri"`);
    communityGroups.forEach(group => {
      console.log(`  - ${group.name} (${group.symbol}) - ${group.group}`);
    });
  } catch (error) {
    console.log('No groups found or error:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 3. Find groups by symbol prefix
  console.log('3. Finding groups by symbol prefix "OPEN"...');
  try {
    const crcGroups = await rpc.group.findGroups(10, {
      symbolStartsWith: 'OPEN',
    });
    console.log(`Found ${crcGroups.length} groups with symbol starting with "OPEN"`);
    crcGroups.forEach(group => {
      console.log(`  - ${group.name || 'Unnamed'} (${group.symbol}) - ${group.group}`);
    });
  } catch (error) {
    console.log('No groups found or error:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 4. Find groups by owner (supports multiple owners with OR query)
  console.log('4. Finding groups owned by test address...');
  const ownedGroups = await rpc.group.findGroups(10, {
    ownerIn: [TEST_ADDRESS],
  });
  console.log(`Found ${ownedGroups.length} groups owned by test address`);
  if (ownedGroups.length > 0) {
    ownedGroups.forEach(group => {
      console.log(`  - ${group.name || 'Unnamed'} (${group.symbol || 'No symbol'})`);
      console.log(`    Address: ${group.group}`);
      console.log(`    Members: ${group.memberCount || 0}`);
      console.log(`    Type: ${group.type}`);
    });
  }
  console.log();

  // 5. Get group memberships for test address
  console.log('5. Getting group memberships for test address...');
  const membershipsQuery = rpc.group.getGroupMemberships(TEST_ADDRESS, 50);

  // Fetch first page
  await membershipsQuery.queryNextPage();
  const memberships = membershipsQuery.currentPage?.results || [];

  console.log(`Found ${memberships.length} group memberships`);

  if (memberships.length > 0) {
    console.log('Group memberships (showing first 5):');
    for (const membership of memberships.slice(0, 5)) {
      const joinedDate = new Date(membership.timestamp * 1000);
      console.log(`  - Group: ${membership.group}`);
      console.log(`    Joined: ${joinedDate.toLocaleString()}`);
      console.log(`    Block: ${membership.blockNumber}`);
      if (membership.expiryTime > 0) {
        const expiryDate = new Date(membership.expiryTime * 1000);
        console.log(`    Expires: ${expiryDate.toLocaleString()}`);
      }
      console.log();
    }

    if (membershipsQuery.currentPage?.hasMore) {
      console.log('(More memberships available - use pagination to fetch additional pages)');
    }
  } else {
    console.log('Test address is not a member of any groups');
  }
  console.log();

  // 6. Find groups by type
  console.log('6. Finding groups by type...');
  try {
    const typeGroups = await rpc.group.findGroups(10, {
      groupTypeIn: ['CrcV2_RegisterGroup'],
    });
    console.log(`Found ${typeGroups.length} groups of type CrcV2_RegisterGroup`);
  } catch (error) {
    console.log('Error:', error instanceof Error ? error.message : error);
  }
  console.log();


}

main().catch(console.error);

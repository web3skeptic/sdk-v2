import { CirclesRpc } from '@aboutcircles/sdk-rpc';

/**
 * This example demonstrates cursor-based pagination using the PagedQuery utility.
 * Cursor-based pagination is more efficient than offset-based pagination,
 * especially for large datasets.
 */

const RPC_URL = process.env.RPC_URL || 'https://rpc.aboutcircles.com';
const AVATAR_ADDRESS = process.env.AVATAR_ADDRESS || '0xYourAvatarAddress';
const GROUP_ADDRESS = process.env.GROUP_ADDRESS || '0xGroupAddress';

async function main() {
  const rpc = new CirclesRpc(RPC_URL);

  console.log('=== Cursor-Based Pagination Examples ===\n');

  // Example 1: Paginate through group members
  console.log('1. Fetching group members with pagination:');
  const membersQuery = rpc.group.getGroupMembers(GROUP_ADDRESS, 10); // 10 per page

  let pageNum = 1;
  while (await membersQuery.queryNextPage()) {
    const page = membersQuery.currentPage!;
    console.log(`\n  Page ${pageNum}:`);
    console.log(`  - Found ${page.size} members`);
    console.log(`  - Has more: ${page.hasMore}`);
    console.log(`  - Members:`, page.results.map((m) => m.member).slice(0, 3));

    pageNum++;
    if (pageNum > 3) break; // Limit to 3 pages for demo
  }

  // Example 2: Paginate through transaction history
  console.log('\n\n2. Fetching transaction history with pagination:');
  const txQuery = rpc.transaction.getTransactionHistory(AVATAR_ADDRESS, 5); // 5 per page

  if (await txQuery.queryNextPage()) {
    const page = txQuery.currentPage!;
    console.log(`  - Found ${page.size} transactions`);
    console.log(`  - First cursor:`, page.firstCursor);
    console.log(`  - Last cursor:`, page.lastCursor);
    console.log('  - Transactions:');
    page.results.forEach((tx) => {
      console.log(`    ${tx.from} -> ${tx.to}: ${tx.circles} CRC`);
    });
  }

  // Example 3: Paginate through trust relations
  console.log('\n\n3. Fetching trust relations with pagination:');
  const trustQuery = rpc.trust.getTrustRelations(AVATAR_ADDRESS, 10);

  if (await trustQuery.queryNextPage()) {
    const page = trustQuery.currentPage!;
    console.log(`  - Found ${page.size} trust relations`);
    console.log(`  - Has more: ${page.hasMore}`);
    console.log('  - Relations:');
    page.results.slice(0, 5).forEach((rel) => {
      console.log(`    ${rel.truster} -> ${rel.trustee}`);
    });
  }

  // Example 4: Paginate through groups
  console.log('\n\n4. Fetching groups with pagination:');
  const groupsQuery = rpc.group.getGroups(5);

  if (await groupsQuery.queryNextPage()) {
    const page = groupsQuery.currentPage!;
    console.log(`  - Found ${page.size} groups`);
    console.log('  - Groups:');
    page.results.forEach((g) => {
      console.log(`    ${g.group}: ${g.name || 'No name'} (${g.symbol || 'No symbol'})`);
    });
  }

  // Example 5: Paginate through group memberships for an avatar
  console.log('\n\n5. Fetching group memberships with pagination:');
  const membershipsQuery = rpc.group.getGroupMemberships(AVATAR_ADDRESS, 10);

  if (await membershipsQuery.queryNextPage()) {
    const page = membershipsQuery.currentPage!;
    console.log(`  - Found ${page.size} memberships`);
    console.log('  - Memberships:');
    page.results.forEach((m) => {
      console.log(`    Group: ${m.group}`);
    });
  }

  // Example 6: Reset and restart pagination
  console.log('\n\n6. Demonstrating query reset:');
  membersQuery.reset();
  console.log('  - Query reset. Starting fresh...');
  if (await membersQuery.queryNextPage()) {
    console.log(`  - Got ${membersQuery.currentPage!.size} members from first page again`);
  }

  // Example 7: Check pagination state
  console.log('\n\n7. Pagination state inspection:');
  const stateQuery = rpc.group.getGroupMembers(GROUP_ADDRESS, 5);

  console.log('  - Before first query:');
  console.log(`    Current page: ${stateQuery.currentPage || 'undefined'}`);

  await stateQuery.queryNextPage();
  console.log('  - After first query:');
  console.log(`    Current page size: ${stateQuery.currentPage?.size}`);
  console.log(`    Has more: ${stateQuery.currentPage?.hasMore}`);
  console.log(`    Sort order: ${stateQuery.currentPage?.sortOrder}`);

  // Example 8: Paginate through group token holders (ordered by balance)
  console.log('\n\n8. Fetching group token holders with pagination:');
  console.log('  Note: Results ordered by totalBalance DESC (highest first)');

  try {
    const holdersQuery = rpc.group.getGroupHolders(GROUP_ADDRESS, 5); // 5 per page

    let holderPageNum = 1;
    while (await holdersQuery.queryNextPage()) {
      const page = holdersQuery.currentPage!;
      console.log(`\n  Page ${holderPageNum}:`);
      console.log(`  - Found ${page.size} holders`);
      console.log(`  - Has more: ${page.hasMore}`);

      if (page.results.length > 0) {
        console.log('  - Top holders:');
        page.results.slice(0, 3).forEach((holder: (typeof page.results)[0]) => {
          const balanceInCrc = Number(holder.totalBalance) / 1e18;
          console.log(`    ${holder.holder}: ${balanceInCrc.toFixed(2)} CRC (${(holder.fractionOwnership * 100).toFixed(2)}%)`);
        });
      }

      holderPageNum++;
      if (holderPageNum > 2) break; // Limit to 2 pages for demo
    }
  } catch (error) {
    console.log(`  - Could not fetch holders: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  console.log('\n=== Pagination Examples Complete ===');
}

main().catch((error) => {
  console.error('Error:', error);
  process.exit(1);
});

/**
 * Comprehensive Profile Example
 *
 * Demonstrates how to build a complete profile view using multiple RPC methods
 */

import { CirclesRpc } from '@circles-sdk/rpc';

const TEST_ADDRESS = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';

async function main() {
  const rpc = new CirclesRpc();

  console.log('=== Comprehensive Profile for Address ===\n');
  console.log(`Address: ${TEST_ADDRESS}\n`);
  console.log('='.repeat(80));
  console.log();

  // 1. Basic Avatar Information
  console.log('📋 BASIC INFORMATION');
  console.log('-'.repeat(80));
  const avatarInfo = await rpc.avatar.getAvatarInfo(TEST_ADDRESS);

  if (!avatarInfo) {
    console.log('❌ Address not found in Circles');
    return;
  }

  console.log(`Type: ${avatarInfo.type}`);
  console.log(`Is Human: ${avatarInfo.isHuman ? '✓ Yes' : '✗ No'}`);
  console.log(`Version: ${avatarInfo.version}`);
  console.log(`Registered: ${new Date(avatarInfo.timestamp * 1000).toLocaleString()}`);
  console.log(`Block: ${avatarInfo.blockNumber}`);
  if (avatarInfo.tokenId) {
    console.log(`Token ID: ${avatarInfo.tokenId}`);
  }
  if (avatarInfo.v1Token) {
    console.log(`V1 Token: ${avatarInfo.v1Token}`);
  }
  if (avatarInfo.name) {
    console.log(`Name: ${avatarInfo.name}`);
  }
  if (avatarInfo.symbol) {
    console.log(`Symbol: ${avatarInfo.symbol}`);
  }
  console.log();

  // 2. Profile Information
  console.log('👤 PROFILE');
  console.log('-'.repeat(80));
  try {
    const profile = await rpc.profile.getProfileByAddress(TEST_ADDRESS);
    if (profile) {
      console.log(`Name: ${profile.name || 'Not set'}`);
      console.log(`Description: ${profile.description || 'Not set'}`);
      console.log(`Location: ${profile.location || 'Not set'}`);
      if (profile.imageUrl) {
        console.log(`Image: ${profile.imageUrl}`);
      }
    } else {
      console.log('No profile information set');
    }
  } catch (error) {
    console.log('Could not fetch profile:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 3. Balance Information
  console.log('💰 BALANCES');
  console.log('-'.repeat(80));
  try {
    const totalBalance = await rpc.balance.getTotalBalance(TEST_ADDRESS);
    console.log(`Total V2 Balance: ${Number(totalBalance) / 1e18} CRC`);

    const tokenBalances = await rpc.balance.getTokenBalances(TEST_ADDRESS);
    console.log(`\nToken Count: ${tokenBalances.length}`);
    console.log('Top 5 token balances:');

    const sortedBalances = tokenBalances.sort((a, b) => b.circles - a.circles);
    sortedBalances.slice(0, 5).forEach((balance, index) => {
      const isOwnToken = balance.tokenAddress.toLowerCase() === TEST_ADDRESS.toLowerCase();
      console.log(`  ${index + 1}. ${balance.circles.toFixed(2)} CRC`);
      console.log(`     Token: ${balance.tokenAddress}${isOwnToken ? ' (own token)' : ''}`);
      console.log(`     Type: v${balance.version} | ${balance.isErc20 ? 'ERC20' : 'ERC1155'}`);
    });
  } catch (error) {
    console.log('Error fetching balances:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 4. Trust Relations
  console.log('🤝 TRUST NETWORK');
  console.log('-'.repeat(80));
  try {
    const aggregated = await rpc.trust.getAggregatedTrustRelations(TEST_ADDRESS);
    const mutualTrusts = await rpc.trust.getMutualTrusts(TEST_ADDRESS);
    const trusts = await rpc.trust.getTrusts(TEST_ADDRESS);
    const trustedBy = await rpc.trust.getTrustedBy(TEST_ADDRESS);

    console.log(`Total Connections: ${aggregated.length}`);
    console.log(`  Mutual Trusts: ${mutualTrusts.length}`);
    console.log(`  Trusts (outgoing): ${trusts.length}`);
    console.log(`  Trusted By (incoming): ${trustedBy.length}`);

    if (mutualTrusts.length > 0) {
      console.log('\nRecent mutual trusts (max 3):');
      mutualTrusts.slice(0, 3).forEach(relation => {
        const date = new Date(relation.timestamp * 1000).toLocaleDateString();
        console.log(`  - ${relation.objectAvatar} (${date})`);
      });
    }
  } catch (error) {
    console.log('Error fetching trust relations:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 5. Transaction Activity
  console.log('💸 RECENT ACTIVITY');
  console.log('-'.repeat(80));
  try {
    const transactions = await rpc.transaction.getTransactionHistory(TEST_ADDRESS, 10);
    console.log(`Recent Transactions: ${transactions.length}`);

    if (transactions.length > 0) {
      const incoming = transactions.filter(tx => tx.to.toLowerCase() === TEST_ADDRESS.toLowerCase());
      const outgoing = transactions.filter(tx => tx.from.toLowerCase() === TEST_ADDRESS.toLowerCase());

      console.log(`  Incoming: ${incoming.length}`);
      console.log(`  Outgoing: ${outgoing.length}`);

      console.log('\nLast 5 transactions:');
      transactions.slice(0, 5).forEach((tx, index) => {
        const date = new Date(tx.timestamp * 1000).toLocaleString();
        const direction = tx.to.toLowerCase() === TEST_ADDRESS.toLowerCase() ? '←' : '→';
        const counterparty = direction === '←' ? tx.from : tx.to;

        console.log(`  ${index + 1}. ${direction} ${date}`);
        console.log(`     ${counterparty.substring(0, 10)}...`);
        console.log(`     Value: ${tx.value} | v${tx.version}`);
      });
    } else {
      console.log('No recent transactions');
    }
  } catch (error) {
    console.log('Error fetching transactions:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 6. Group Memberships
  console.log('👥 GROUP MEMBERSHIPS');
  console.log('-'.repeat(80));
  try {
    const memberships = await rpc.group.getGroupMemberships(TEST_ADDRESS, 10);
    console.log(`Member of ${memberships.length} groups`);

    if (memberships.length > 0) {
      console.log('\nGroups:');
      for (const membership of memberships.slice(0, 3)) {
        console.log(`  - ${membership.group}`);
        console.log(`    Joined: ${new Date(membership.timestamp * 1000).toLocaleDateString()}`);
      }
    }
  } catch (error) {
    console.log('Error fetching group memberships:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 7. Invitation Information
  console.log('📨 INVITATIONS');
  console.log('-'.repeat(80));
  try {
    const invitedBy = await rpc.invitation.getInvitedBy(TEST_ADDRESS);
    const acceptedInvites = await rpc.invitation.getInvitationsFrom(TEST_ADDRESS, true);
    const pendingInvites = await rpc.invitation.getInvitationsFrom(TEST_ADDRESS, false);

    console.log(`Invited By: ${invitedBy || 'None'}`);
    console.log(`Invitations Sent:`);
    console.log(`  Accepted: ${acceptedInvites.length}`);
    console.log(`  Pending: ${pendingInvites.length}`);
  } catch (error) {
    console.log('Error fetching invitation info:', error instanceof Error ? error.message : error);
  }
  console.log();

  console.log('='.repeat(80));
  console.log('✅ Profile complete!');
}

main().catch(console.error);

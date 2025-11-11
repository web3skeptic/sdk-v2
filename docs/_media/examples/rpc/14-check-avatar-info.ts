/**
 * Check Avatar Information
 *
 * Comprehensive example to retrieve and display detailed information
 * about a specific Circles avatar address.
 *
 * This example demonstrates:
 * - Getting basic avatar information
 * - Retrieving profile data
 * - Checking token balances
 * - Analyzing trust network
 * - Viewing transaction history
 * - Checking group memberships
 * - Reviewing invitation information
 *
 * Note: This example requires a working internet connection and access
 * to the Circles RPC endpoint. If you encounter connection errors,
 * please verify your network connectivity.
 */

import { CirclesRpc } from '@aboutcircles/sdk-rpc';

// The address to check
const TARGET_ADDRESS = '0xf3f59984a5bab94938a44229f3ee6f6d2d8e2cbe';

async function checkAvatarInfo() {
  // Use default RPC endpoint or specify custom one
  const rpc = new CirclesRpc();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('           CIRCLES AVATAR INFORMATION CHECK');
  console.log('═══════════════════════════════════════════════════════════');
  console.log();
  console.log(`Address: ${TARGET_ADDRESS}`);
  console.log();
  console.log('═══════════════════════════════════════════════════════════');
  console.log();

  // 1. Basic Avatar Information
  console.log('📋 BASIC AVATAR INFORMATION');
  console.log('─'.repeat(60));

  try {
    const avatarInfo = await rpc.avatar.getAvatarInfo(TARGET_ADDRESS);

    if (!avatarInfo) {
      console.log('❌ This address is not registered in Circles network');
      return;
    }

    console.log('✅ Avatar found in Circles network\n');
    console.log('Avatar Details:');
    console.log(`  Type:           ${avatarInfo.type}`);
    console.log(`  Is Human:       ${avatarInfo.isHuman ? '✓ Yes' : '✗ No'}`);
    console.log(`  Version:        ${avatarInfo.version}`);
    if (avatarInfo.timestamp) {
      console.log(`  Registered:     ${new Date(avatarInfo.timestamp * 1000).toLocaleString()}`);
    }
    console.log(`  Block Number:   ${avatarInfo.blockNumber}`);
    console.log(`  Transaction:    ${avatarInfo.transactionHash || 'N/A'}`);

    if (avatarInfo.tokenId) {
      console.log(`  Token ID:       ${avatarInfo.tokenId}`);
    }
    if (avatarInfo.v1Token) {
      console.log(`  V1 Token:       ${avatarInfo.v1Token}`);
    }
    if (avatarInfo.name) {
      console.log(`  Name:           ${avatarInfo.name}`);
    }
    if (avatarInfo.symbol) {
      console.log(`  Symbol:         ${avatarInfo.symbol}`);
    }
    if (avatarInfo.cidV0) {
      console.log(`  CID V0:         ${avatarInfo.cidV0}`);
    }
  } catch (error) {
    console.log('❌ Error fetching avatar info:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 2. Profile Information
  console.log('👤 PROFILE INFORMATION');
  console.log('─'.repeat(60));

  try {
    const profile = await rpc.profile.getProfileByAddress(TARGET_ADDRESS);

    if (profile) {
      console.log(`  Name:           ${profile.name || 'Not set'}`);
      console.log(`  Description:    ${profile.description || 'Not set'}`);
      console.log(`  Location:       ${profile.location || 'Not set'}`);

      if (profile.imageUrl) {
        console.log(`  Image URL:      ${profile.imageUrl}`);
      }
      if (profile.previewImageUrl) {
        console.log(`  Preview Image:  ${profile.previewImageUrl}`);
      }
    } else {
      console.log('  No profile information set');
    }
  } catch (error) {
    console.log('  Error fetching profile:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 3. Balance Information
  console.log('💰 BALANCE INFORMATION');
  console.log('─'.repeat(60));

  try {
    const totalBalance = await rpc.balance.getTotalBalance(TARGET_ADDRESS);
    console.log(`  Total V2 Balance: ${(Number(totalBalance) / 1e18).toFixed(4)} CRC\n`);

    const tokenBalances = await rpc.balance.getTokenBalances(TARGET_ADDRESS);
    console.log(`  Holds ${tokenBalances.length} different token types\n`);

    if (tokenBalances.length > 0) {
      const sortedBalances = tokenBalances.sort((a, b) => b.circles - a.circles);
      console.log('  Top 5 Token Holdings:');

      sortedBalances.slice(0, 5).forEach((balance, index) => {
        const isOwnToken = balance.tokenAddress.toLowerCase() === TARGET_ADDRESS.toLowerCase();
        console.log(`    ${index + 1}. ${balance.circles.toFixed(4)} CRC`);
        console.log(`       Token:   ${balance.tokenAddress}${isOwnToken ? ' (own token)' : ''}`);
        console.log(`       Version: v${balance.version} | ${balance.isErc20 ? 'ERC20' : 'ERC1155'}`);
        console.log();
      });
    }
  } catch (error) {
    console.log('  Error fetching balances:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 4. Trust Network
  console.log('🤝 TRUST NETWORK');
  console.log('─'.repeat(60));

  try {
    const aggregated = await rpc.trust.getAggregatedTrustRelations(TARGET_ADDRESS);
    const mutualTrusts = await rpc.trust.getMutualTrusts(TARGET_ADDRESS);
    const trusts = await rpc.trust.getTrusts(TARGET_ADDRESS);
    const trustedBy = await rpc.trust.getTrustedBy(TARGET_ADDRESS);

    console.log(`  Total Connections:      ${aggregated.length}`);
    console.log(`  Mutual Trusts:          ${mutualTrusts.length}`);
    console.log(`  Trusts (outgoing):      ${trusts.length}`);
    console.log(`  Trusted By (incoming):  ${trustedBy.length}\n`);

    if (mutualTrusts.length > 0) {
      console.log('  Recent Mutual Trusts (max 5):');
      mutualTrusts.slice(0, 5).forEach((relation, index) => {
        const date = new Date(relation.timestamp * 1000).toLocaleDateString();
        console.log(`    ${index + 1}. ${relation.objectAvatar}`);
        console.log(`       Date: ${date}\n`);
      });
    }
  } catch (error) {
    console.log('  Error fetching trust relations:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 5. Transaction Activity
  console.log('💸 TRANSACTION ACTIVITY');
  console.log('─'.repeat(60));

  try {
    const transactions = await rpc.transaction.getTransactionHistory(TARGET_ADDRESS, 10);
    console.log(`  Recent Transactions: ${transactions.length}\n`);

    if (transactions && transactions.length > 0) {
      const incoming = transactions.filter((tx: any) =>
        tx.to.toLowerCase() === TARGET_ADDRESS.toLowerCase()
      );
      const outgoing = transactions.filter((tx: any) =>
        tx.from.toLowerCase() === TARGET_ADDRESS.toLowerCase()
      );

      console.log(`  Incoming: ${incoming.length} | Outgoing: ${outgoing.length}\n`);

      console.log('  Last 5 Transactions:');
      transactions.slice(0, 5).forEach((tx: any, index: number) => {
        const date = new Date(tx.timestamp * 1000).toLocaleString();
        const direction = tx.to.toLowerCase() === TARGET_ADDRESS.toLowerCase() ? '←' : '→';
        const counterparty = direction === '←' ? tx.from : tx.to;

        console.log(`    ${index + 1}. ${direction} ${date}`);
        console.log(`       ${counterparty}`);
        console.log(`       Value: ${tx.value} | Version: v${tx.version}`);
        console.log(`       Hash: ${tx.transactionHash}\n`);
      });
    } else {
      console.log('  No recent transactions found');
    }
  } catch (error) {
    console.log('  Error fetching transactions:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 6. Group Memberships
  console.log('👥 GROUP MEMBERSHIPS');
  console.log('─'.repeat(60));

  try {
    const membershipsQuery = rpc.group.getGroupMemberships(TARGET_ADDRESS, 50);
    await membershipsQuery.queryNextPage();
    const memberships = membershipsQuery.currentPage?.results || [];

    console.log(`  Member of ${memberships.length} groups\n`);

    if (memberships.length > 0) {
      console.log('  Groups:');
      for (const membership of memberships.slice(0, 5)) {
        console.log(`    - ${membership.group}`);
        console.log(`      Joined: ${new Date(membership.timestamp * 1000).toLocaleDateString()}\n`);
      }
    }
  } catch (error) {
    console.log('  Error fetching group memberships:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 7. Invitation Information
  console.log('📨 INVITATION INFORMATION');
  console.log('─'.repeat(60));

  try {
    const invitedBy = await rpc.invitation.getInvitedBy(TARGET_ADDRESS);
    const acceptedInvites = await rpc.invitation.getInvitationsFrom(TARGET_ADDRESS, true);
    const pendingInvites = await rpc.invitation.getInvitationsFrom(TARGET_ADDRESS, false);

    console.log(`  Invited By:          ${invitedBy || 'Self-registered or unknown'}`);
    console.log(`  Invitations Sent:`);
    console.log(`    Accepted:          ${acceptedInvites.length}`);
    console.log(`    Pending:           ${pendingInvites.length}`);

    if (acceptedInvites.length > 0) {
      console.log(`\n  Recent Accepted Invitations (max 3):`);
      acceptedInvites.slice(0, 3).forEach((inviteeAddress, index) => {
        console.log(`    ${index + 1}. ${inviteeAddress}`);
      });
    }

    if (pendingInvites.length > 0) {
      console.log(`\n  Pending Invitations (max 3):`);
      pendingInvites.slice(0, 3).forEach((inviteeAddress, index) => {
        console.log(`    ${index + 1}. ${inviteeAddress}`);
      });
    }
  } catch (error) {
    console.log('  Error fetching invitation info:', error instanceof Error ? error.message : error);
  }
  console.log();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ Avatar information check complete!');
  console.log('═══════════════════════════════════════════════════════════');
}

// Run the check
checkAvatarInfo().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});

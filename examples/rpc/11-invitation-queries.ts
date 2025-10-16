/**
 * Invitation Query Examples
 *
 * Demonstrates how to query invitation-related information
 */

import { CirclesRpc } from '@circles-sdk/rpc';

const TEST_ADDRESS = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';

async function main() {
  const rpc = new CirclesRpc();

  console.log('=== Invitation Query Examples ===\n');
  console.log(`Test Address: ${TEST_ADDRESS}\n`);

  // 1. Check who invited this address
  console.log('1. Checking who invited this address...');
  const inviter = await rpc.invitation.getInvitedBy(TEST_ADDRESS);
  if (inviter) {
    console.log(`Invited by: ${inviter}`);

    // Get inviter info
    const inviterInfo = await rpc.avatar.getAvatarInfo(inviter);
    if (inviterInfo) {
      console.log('Inviter details:');
      console.log(`  Type: ${inviterInfo.type}`);
      console.log(`  Is Human: ${inviterInfo.isHuman}`);
      console.log(`  Version: ${inviterInfo.version}`);
      console.log(`  Registered: ${new Date(inviterInfo.timestamp * 1000).toLocaleString()}`);
    }
  } else {
    console.log('Not invited by anyone (or no invitation record found)');
  }
  console.log();

  // 2. Get available invitations for this address
  console.log('2. Getting available invitations for this address...');
  try {
    const invitations = await rpc.invitation.getInvitations(TEST_ADDRESS);
    console.log(`Found ${invitations.length} available inviters`);

    if (invitations.length > 0) {
      console.log('Available inviters:');
      invitations.slice(0, 5).forEach((inviterInfo, index) => {
        console.log(`  ${index + 1}. ${inviterInfo.avatar}`);
        console.log(`     Name: ${inviterInfo.name || 'No name set'}`);
        console.log(`     Registered: ${new Date(inviterInfo.timestamp * 1000).toLocaleString()}`);
      });
    } else {
      console.log('No available invitations (either already on v2 or no one trusts this address)');
    }
  } catch (error) {
    console.log('Error:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 3. Check accepted invitations sent by this address
  console.log('3. Checking accepted invitations sent by this address...');
  try {
    const acceptedInvitations = await rpc.invitation.getInvitationsFrom(TEST_ADDRESS, true);
    console.log(`Found ${acceptedInvitations.length} accepted invitations`);

    if (acceptedInvitations.length > 0) {
      console.log('Accepted invitations (people who used this address as inviter):');
      for (const inviteeAddress of acceptedInvitations.slice(0, 5)) {
        console.log(`  - ${inviteeAddress}`);

        // Get invitee info
        const inviteeInfo = await rpc.avatar.getAvatarInfo(inviteeAddress);
        if (inviteeInfo) {
          console.log(`    Joined: ${new Date(inviteeInfo.timestamp * 1000).toLocaleString()}`);
        }
      }
    }
  } catch (error) {
    console.log('Error:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 4. Check pending invitations sent by this address
  console.log('4. Checking pending invitations sent by this address...');
  try {
    const pendingInvitations = await rpc.invitation.getInvitationsFrom(TEST_ADDRESS, false);
    console.log(`Found ${pendingInvitations.length} pending invitations`);

    if (pendingInvitations.length > 0) {
      console.log('Pending invitations (addresses trusted but not yet registered):');
      pendingInvitations.slice(0, 5).forEach(address => {
        console.log(`  - ${address}`);
      });
    } else {
      console.log('No pending invitations');
    }
  } catch (error) {
    console.log('Error:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 5. Full invitation flow example
  console.log('5. Full invitation statistics for test address...');
  try {
    const [accepted, pending, receivedFrom] = await Promise.all([
      rpc.invitation.getInvitationsFrom(TEST_ADDRESS, true),
      rpc.invitation.getInvitationsFrom(TEST_ADDRESS, false),
      rpc.invitation.getInvitedBy(TEST_ADDRESS),
    ]);

    console.log('Summary:');
    console.log(`  Invited by: ${receivedFrom || 'None'}`);
    console.log(`  Accepted invitations sent: ${accepted.length}`);
    console.log(`  Pending invitations sent: ${pending.length}`);
    console.log(`  Total invitations sent: ${accepted.length + pending.length}`);
  } catch (error) {
    console.log('Error:', error instanceof Error ? error.message : error);
  }
  console.log();

  // 6. Check invitation eligibility
  console.log('6. Checking invitation eligibility...');
  const avatarInfo = await rpc.avatar.getAvatarInfo(TEST_ADDRESS);
  if (avatarInfo) {
    if (avatarInfo.isHuman) {
      console.log('✓ This address is a human and can invite others');

      // Check if they have enough balance to invite
      try {
        const balances = await rpc.balance.getTokenBalances(TEST_ADDRESS);
        const ownToken = balances.find(b => b.tokenAddress.toLowerCase() === TEST_ADDRESS.toLowerCase());

        if (ownToken) {
          const MIN_TOKENS_REQUIRED = 96;
          const canInvite = ownToken.circles >= MIN_TOKENS_REQUIRED;

          console.log(`  Own token balance: ${ownToken.circles.toFixed(2)} CRC`);
          console.log(`  Can invite: ${canInvite ? '✓ Yes' : '✗ No (need at least 96 CRC)'}`);
        }
      } catch (error) {
        console.log('  Could not check balance:', error instanceof Error ? error.message : error);
      }
    } else {
      console.log('✗ This address is not a human and cannot invite others');
    }
  } else {
    console.log('Address not registered in Circles');
  }
}

main().catch(console.error);

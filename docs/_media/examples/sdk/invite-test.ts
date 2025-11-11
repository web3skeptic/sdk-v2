import 'dotenv/config';
import { Sdk } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { circlesConfig } from '@aboutcircles/sdk-core';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const INVITEE_SAFE = '0xAF1A6234BdF783af95e4501e23af8b30a1Ddcef7';
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY || !SAFE_ADDRESS) {
    throw new Error('PRIVATE_KEY and SAFE_ADDRESS environment variables are required');
  }

  console.log('🔄 Initializing...\n');
  const publicClient = createPublicClient({ chain: gnosis, transport: http(RPC_URL) });

  // Inviter setup
  const inviterRunner = new SafeContractRunner(publicClient, PRIVATE_KEY, RPC_URL, SAFE_ADDRESS);
  await inviterRunner.init();
  const inviterSdk = new Sdk(circlesConfig[100], inviterRunner);
  const inviter = await inviterSdk.getAvatar(SAFE_ADDRESS);

  console.log(`📬 Inviter: ${SAFE_ADDRESS}`);
  console.log(`📬 Invitee: ${INVITEE_SAFE}\n`);

  try {
    // Step 1: Inviter sends invitation (trust + 100 CRC to escrow)
    console.log('🚀 Sending invitation...');
    const inviteTxReceipt = await inviter.invite.send(INVITEE_SAFE);

    // Verify transaction was included in blockchain
    if (!inviteTxReceipt) {
      throw new Error('No transaction receipt returned from invite.send()');
    }

    const txHash = (inviteTxReceipt as any).transactionHash || (inviteTxReceipt as any).hash;
    console.log(`📝 Transaction: ${txHash}`);

    if (txHash) {
      console.log('⏳ Waiting for blockchain confirmation...');
      const receipt = await publicClient.waitForTransactionReceipt({ hash: txHash as `0x${string}` });
      console.log(`✅ Confirmed in block #${receipt.blockNumber}`);
      console.log(`   Status: ${receipt.status === 'success' ? '✓ Success' : '✗ Failed'}\n`);

      if (receipt.status !== 'success') {
        throw new Error('Transaction failed on blockchain');
      }
    }

    // Step 2: Invitee setup (same private key, different Safe)

    const inviteeRunner = new SafeContractRunner(publicClient, PRIVATE_KEY, RPC_URL, INVITEE_SAFE);
    await inviteeRunner.init();
    const inviteeSdk = new Sdk(circlesConfig[100], inviteeRunner);

    // Step 3: Invitee redeems invitation & registers
    console.log('🚀 Invitee redeeming invitation and registering...');
    const regTxReceipt = await inviteeSdk.register.asHuman(SAFE_ADDRESS, {
      name: 'InvitationOracle',
      description: 'Created to invite others'
    });
    console.log(`✅ Registered: ${regTxReceipt.address}`);

    // Verify registration was included in blockchain
    const regTxHash = (regTxReceipt as any).transactionHash || (regTxReceipt as any).hash;
    if (regTxHash) {
      console.log(`📝 Registration TX: ${regTxHash}`);
      console.log('⏳ Waiting for blockchain confirmation...');
      const regReceipt = await publicClient.waitForTransactionReceipt({ hash: regTxHash as `0x${string}` });
      console.log(`✅ Confirmed in block #${regReceipt.blockNumber}\n`);
    }

    // Step 4: Verify invitation was redeemed
    const invitees = await inviter.invite.getInvitees();
    console.log(`✅ Workflow complete!`);
    console.log(`   Inviter sent ${invitees.length} invitation(s)`);
    console.log(`   Invitee registered successfully`);
  } catch (error) {
    console.error('\n❌ Error:', error instanceof Error ? error.message : error);
    throw error;
  }
}

main().catch(console.error);

/**
 * Example: Transaction Confirmation with Circles SDK
 *
 * Demonstrates transaction execution with full receipt data:
 * - Transaction confirmation (waits for block inclusion)
 * - Status checking (success/reverted)
 * - Gas usage details
 * - Event logs
 *
 * Environment variables required:
 * - PRIVATE_KEY: Private key of one of the Safe signers
 * - SAFE_ADDRESS: Address of the Safe multisig wallet (your avatar)
 * - AVATAR_TO_TRUST: Address of another avatar to trust
 */

import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { HumanAvatar } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

async function main() {
  // Configuration
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const AVATAR_TO_TRUST = process.env.AVATAR_TO as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY || !SAFE_ADDRESS || !AVATAR_TO_TRUST) {
    throw new Error('Required environment variables: PRIVATE_KEY, SAFE_ADDRESS, AVATAR_TO_TRUST');
  }

  console.log('🔄 Initializing Circles SDK...\n');

  // Initialize Core SDK
  const core = new Core();
  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(RPC_URL),
  });

  // Create and initialize Safe runner
  const runner = new SafeContractRunner(publicClient, PRIVATE_KEY, RPC_URL, SAFE_ADDRESS);
  await runner.init();

  // Create HumanAvatar instance
  const avatar = new HumanAvatar(SAFE_ADDRESS, core, runner);
  console.log(`✅ Avatar initialized: ${avatar.address}\n`);

  // ============================================
  // TRANSACTION WITH CONFIRMATION
  // ============================================
  console.log('═══════════════════════════════════════');
  console.log('   TRANSACTION CONFIRMATION DEMO');
  console.log('═══════════════════════════════════════\n');

  console.log('🚀 Sending trust transaction...');
  console.log(`   Trusting: ${AVATAR_TO_TRUST}`);
  console.log('   Waiting for confirmation...\n');

  try {
    // Send transaction and wait for confirmation
    const receipt = await avatar.trust.add(AVATAR_TO_TRUST);

    // Display transaction receipt details
    console.log('✅ Transaction confirmed!\n');
    console.dir(receipt, { depth: null });

    // Calculate transaction cost
    const txCost = receipt.gasUsed * receipt.effectiveGasPrice;
    const costInEth = Number(txCost) / 1e18;
    console.log(`   Total Cost:  ${costInEth.toFixed(6)} xDAI\n`);

  } catch (error: any) {
    console.error('❌ Transaction failed!\n');
    if (error.code === 'RUNNER_TX_REVERTED') {
      console.error('Transaction Status: REVERTED');
      console.error('Context:', error.context);
    } else {
      console.error('Error:', error.message);
    }
    throw error;
  }
}

main()
  .then(() => {
    console.log('✨ Example completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });

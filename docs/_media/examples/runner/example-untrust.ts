/**
 * Example: Untrust Operation using Circles SDK with Safe
 *
 * This example demonstrates how to:
 * 1. Initialize the Core SDK
 * 2. Create a SafeContractRunner
 * 3. Execute an untrust operation through a Safe multisig
 *
 * To untrust an address in Circles, you call the trust function
 * with an expiry time of 0, which removes the trust relationship.
 *
 * Environment variables required (see .env.example):
 * - PRIVATE_KEY: Private key of one of the Safe signers
 * - SAFE_ADDRESS: Address of the Safe multisig wallet
 * - ADDRESS_TO_UNTRUST: Address to remove trust from
 */

import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

async function main() {
  // Configuration
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const ADDRESS_TO_UNTRUST = process.env.ADDRESS_TO_UNTRUST as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }

  if (!SAFE_ADDRESS) {
    throw new Error('SAFE_ADDRESS environment variable is required');
  }

  if (!ADDRESS_TO_UNTRUST) {
    throw new Error('ADDRESS_TO_UNTRUST environment variable is required');
  }

  console.log('🔄 Initializing Circles SDK...\n');

  // Step 1: Initialize the Core SDK
  const core = new Core();
  console.log('✅ Core SDK initialized');
  console.log(`   Hub V2 Address: ${core.config.v2HubAddress}\n`);

  // Step 2: Create a public client for reading blockchain state
  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(RPC_URL),
  });

  // Step 3: Create the Safe contract runner
  const runner = new SafeContractRunner(
    publicClient,
    PRIVATE_KEY,
    RPC_URL,
    SAFE_ADDRESS
  );

  // Initialize the runner
  await runner.init();
  console.log('✅ Safe contract runner initialized');
  console.log(`   Safe Address: ${runner.address}\n`);

  // Step 4: Check current trust status
  console.log('🔍 Checking current trust status...');
  const isTrusted = await core.hubV2.isTrusted(runner.address!, ADDRESS_TO_UNTRUST);
  console.log(`   Current trust status: ${isTrusted ? 'TRUSTED' : 'NOT TRUSTED'}\n`);

  if (!isTrusted) {
    console.log('ℹ️  Address is not currently trusted. No action needed.');
    return;
  }

  // Step 5: Create the untrust transaction
  // To untrust, we call trust with expiry = 0
  console.log('📝 Creating untrust transaction...');
  const untrustTx = core.hubV2.trust(
    ADDRESS_TO_UNTRUST,
    BigInt(0) // expiry = 0 means untrust
  );

  console.log('   Transaction details:');
  console.log(`   - To: ${untrustTx.to}`);
  console.log(`   - Data: ${untrustTx.data}`);
  console.log(`   - Value: ${untrustTx.value || 0}\n`);

  // Step 6: Estimate gas
  console.log('⛽ Estimating gas...');
  const gasEstimate = await runner.estimateGas!(untrustTx);
  console.log(`   Estimated gas: ${gasEstimate}\n`);

  // Step 7: Send the transaction
  console.log('🚀 Sending untrust transaction...');
  const txResponse = await runner.sendTransaction!([untrustTx]);
  console.log('✅ Transaction sent!');
  console.log(`   Transaction hash: ${txResponse.hash}`);
  console.log(`   Block number: ${txResponse.blockNumber}`);
  console.log(`   Block hash: ${txResponse.blockHash}\n`);

  // Step 8: Verify the untrust was successful
  console.log('🔍 Verifying untrust...');
  const newTrustStatus = await core.hubV2.isTrusted(runner.address!, ADDRESS_TO_UNTRUST);
  console.log(`   New trust status: ${newTrustStatus ? 'TRUSTED' : 'NOT TRUSTED'}\n`);

  if (!newTrustStatus) {
    console.log('🎉 Successfully untrusted the address!');
  } else {
    console.log('⚠️  Warning: Address is still trusted. The transaction may need more time to be processed.');
  }
}

// Run the example
main()
  .then(() => {
    console.log('\n✨ Example completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  });

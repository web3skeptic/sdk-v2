/**
 * Example: Trust Zero Address using Circles SDK with Safe
 *
 * This example demonstrates how to:
 * 1. Initialize the Core SDK
 * 2. Create a SafeContractRunner with a human avatar
 * 3. Execute a trust operation to trust the zero address
 *
 * The zero address (0x0000000000000000000000000000000000000000) is used
 * for testing purposes to demonstrate the trust mechanism.
 *
 * Environment variables required (see .env):
 * - PRIVATE_KEY: Private key of one of the Safe signers
 * - SAFE_ADDRESS: Address of the Safe multisig wallet (human avatar)
 */

import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { parseContractError } from '@aboutcircles/sdk-utils';
import { hubV2Abi } from '@aboutcircles/sdk-abis';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

async function main() {
  // Configuration
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY) {
    throw new Error('PRIVATE_KEY environment variable is required');
  }

  if (!SAFE_ADDRESS) {
    throw new Error('SAFE_ADDRESS environment variable is required');
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

  // Step 3: Create the Safe contract runner for the human avatar
  const runner = new SafeContractRunner(
    publicClient,
    PRIVATE_KEY,
    RPC_URL,
    SAFE_ADDRESS
  );

  // Initialize the runner
  await runner.init();
  console.log('✅ Safe contract runner initialized');
  console.log(`   Human Avatar Address: ${runner.address}\n`);

  // Step 4: Check current trust status with zero address
  console.log('🔍 Checking current trust status with zero address...');
  const isTrusted = await core.hubV2.isTrusted(runner.address!, ZERO_ADDRESS);
  console.log(`   Current trust status: ${isTrusted ? 'TRUSTED' : 'NOT TRUSTED'}\n`);

  if (isTrusted) {
    console.log('ℹ️  Zero address is already trusted. No action needed.');
    return;
  }

  // Step 5: Create the trust transaction
  // Trust for 1 year (current time + 365 days)
  const oneYearFromNow = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

  console.log('📝 Creating trust transaction for zero address...');
  const trustTx = core.hubV2.trust(
    ZERO_ADDRESS,
    oneYearFromNow
  );

  console.log('   Transaction details:');
  console.log(`   - To: ${trustTx.to}`);
  console.log(`   - Target: ${ZERO_ADDRESS}`);
  console.log(`   - Expiry: ${oneYearFromNow} (${new Date(Number(oneYearFromNow) * 1000).toISOString()})`);
  console.log(`   - Data: ${trustTx.data}`);
  console.log(`   - Value: ${trustTx.value || 0}\n`);

  // Step 6: Estimate gas and send transaction with error handling
  try {
    console.log('⛽ Estimating gas...');
    const gasEstimate = await runner.estimateGas!(trustTx);
    console.log(`   Estimated gas: ${gasEstimate}\n`);

    // Step 7: Send the transaction
    console.log('🚀 Sending trust transaction...');
    const txResponse = await runner.sendTransaction!([trustTx]);
    console.log('✅ Transaction sent!');
    console.log(`   Transaction hash: ${txResponse.transactionHash}`);
    console.log(`   Block number: ${txResponse.blockNumber}`);
    console.log(`   Block hash: ${txResponse.blockHash}\n`);

    // Step 8: Verify the trust was successful
    console.log('🔍 Verifying trust...');
    const newTrustStatus = await core.hubV2.isTrusted(runner.address!, ZERO_ADDRESS);
    console.log(`   New trust status: ${newTrustStatus ? 'TRUSTED' : 'NOT TRUSTED'}\n`);

    if (newTrustStatus) {
      console.log('🎉 Successfully trusted the zero address!');
    } else {
      console.log('⚠️  Warning: Zero address is not trusted. The transaction may need more time to be processed.');
    }
  } catch (error: any) {
    // Parse the contract error
    console.log('❌ Transaction failed!\n');

    const decodedError = parseContractError(error, hubV2Abi);

    if (decodedError) {
      console.log('📋 Decoded Contract Error:');
      console.log(`   Error Name: ${decodedError.errorName}`);
      console.log(`   Error Message: ${decodedError.formattedMessage}`);
      console.log(`   Error Selector: ${decodedError.selector}`);

      if (decodedError.args && decodedError.args.length > 0) {
        console.log(`   Error Arguments:`);
        decodedError.args.forEach((arg: any, index: number) => {
          const value = typeof arg === 'bigint' ? arg.toString() : arg;
          console.log(`     [${index}]: ${value} (0x${typeof arg === 'bigint' || typeof arg === 'number' ? arg.toString(16) : arg})`);
        });
      }

      console.log(`\n   Raw Error Data: ${decodedError.rawData}`);
    } else {
      console.log('⚠️  Could not decode contract error');
      console.log(`   Error Message: ${error.message}`);
    }

    throw error;
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

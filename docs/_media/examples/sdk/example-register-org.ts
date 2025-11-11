/**
 * Example: Register Organization
 *
 * Minimal example to test organization registration.
 *
 * Environment variables required:
 * - PRIVATE_KEY: Private key of one of the Safe signers
 * - SAFE_ADDRESS: Address of the Safe multisig wallet (must not be registered yet)
 */

import 'dotenv/config';
import { Sdk } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY || !SAFE_ADDRESS) {
    throw new Error('Required environment variables: PRIVATE_KEY, SAFE_ADDRESS');
  }

  console.log('🔄 Initializing SDK...\n');

  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(RPC_URL),
  });

  const runner = new SafeContractRunner(publicClient, PRIVATE_KEY, RPC_URL, SAFE_ADDRESS);
  await runner.init();

  const sdk = new Sdk(undefined, runner);
  console.log(`✅ SDK initialized: ${sdk.senderAddress}\n`);

  console.log('🚀 Registering organization...\n');

  const orgAvatar = await sdk.register.asOrganization({
    name: 'Test Organization',
    description: 'A test organization for Circles'
  });

  console.log('✅ Organization registered!');
  console.log(`   Address: ${orgAvatar.address}\n`);
}

main()
  .then(() => {
    console.log('✨ Example completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });

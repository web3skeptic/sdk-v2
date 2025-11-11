/**
 * Example: Register Base Group
 *
 * Demonstrates how to create and register a new base group using the SDK.
 *
 * Environment variables required:
 * - PRIVATE_KEY: Private key of one of the Safe signers
 * - SAFE_ADDRESS: Address of the Safe multisig wallet that will own the group
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

  console.log('🚀 Registering base group...\n');

  // Register a new base group
  // Parameters:
  // - owner: The Safe that will own the group
  // - service: Service address (can be zero address if not using services)
  // - feeCollection: Fee collection address (can be zero address)
  // - initialConditions: Array of membership condition contract addresses
  // - name: The group name (must be 19 characters or fewer)
  // - symbol: The group symbol
  // - profile: Profile with description, images, and other metadata
  const groupAvatar = await sdk.register.asGroup(
    SAFE_ADDRESS, // owner
    '0x0000000000000000000000000000000000000000', // service (zero address for now)
    '0x0000000000000000000000000000000000000000', // feeCollection (zero address for now)
    [], // initialConditions (empty for now)
    'Test Circle Group', // name
    'TMCG', // symbol
    {
      name: 'Test Circle Group',
      description: 'A community-managed base group in the Circles ecosystem',
      imageUrl: 'https://example.com/group-image.png'
    }
  );

  console.log('✅ Base group registered!');
  console.log(`   Group Address: ${groupAvatar.address}`);
  console.log(`   Owner: ${SAFE_ADDRESS}\n`);

  // Get group properties
  console.log('📋 Group Properties:');
  const owner = await groupAvatar.properties.owner();
  const service = await groupAvatar.properties.service();
  const feeCollection = await groupAvatar.properties.feeCollection();
  console.log(`   Owner: ${owner}`);
  console.log(`   Service: ${service}`);
  console.log(`   Fee Collection: ${feeCollection}\n`);

  // Get the group profile
  const profile = await groupAvatar.profile.get();
  if (profile) {
    console.log('📝 Group Profile:');
    console.log(`   Name: ${profile.name}`);
    console.log(`   Description: ${profile.description}`);
    if ('symbol' in profile) {
      console.log(`   Symbol: ${profile.symbol}`);
    }
  }
}

main()
  .then(() => {
    console.log('\n✨ Example completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });

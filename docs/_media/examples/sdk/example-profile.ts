import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { HumanAvatar } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';
import type { Profile } from '@aboutcircles/sdk-types';

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY || !SAFE_ADDRESS) {
    throw new Error('PRIVATE_KEY and SAFE_ADDRESS environment variables are required');
  }

  console.log('🔄 Initializing SDK...\n');

  // Initialize Core SDK
  const core = new Core();

  // Create public client
  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(RPC_URL),
  });

  // Create Safe contract runner
  const runner = new SafeContractRunner(
    publicClient,
    PRIVATE_KEY,
    RPC_URL,
    SAFE_ADDRESS
  );
  await runner.init();

  // Create HumanAvatar instance
  const avatar = new HumanAvatar(SAFE_ADDRESS, core, runner);

  console.log('✅ SDK initialized');
  console.log(`   Avatar Address: ${avatar.address}\n`);

  // Get current profile
  console.log('🔍 Fetching current profile...');
  const currentProfile = await avatar.profile.get();
  if (currentProfile) {
    console.log('   Current profile:');
    console.log(`   - Name: ${currentProfile.name || 'N/A'}`);
    console.log(`   - Description: ${currentProfile.description || 'N/A'}\n`);
  } else {
    console.log('   No profile found\n');
  }

  // Create new profile data
  const newProfile: Profile = {
    name: 'web3skeptic',
    description: 'building Circles',
  };

  console.log('📝 Updating profile...');
  console.log(`   Name: ${newProfile.name}`);
  console.log(`   Description: ${newProfile.description}\n`);

  // Update profile (pins to IPFS and updates on-chain metadata)
  console.log('🚀 Sending update transaction...');
  const cid = await avatar.profile.update(newProfile);

  console.log('✅ Profile updated!');
  console.log(`   CID: ${cid}\n`);

  // Verify the update
  console.log('🔍 Verifying update...');
  const updatedProfile = await avatar.profile.get();
  if (updatedProfile) {
    console.log('   Updated profile:');
    console.log(`   - Name: ${updatedProfile.name}`);
    console.log(`   - Description: ${updatedProfile.description}\n`);
  }

  console.log('✨ Profile update completed successfully!');
}

main()
  .then(() => {
    console.log('\n✅ Example completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    process.exit(1);
  });

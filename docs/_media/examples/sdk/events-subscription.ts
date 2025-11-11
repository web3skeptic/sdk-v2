import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { HumanAvatar } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY || !SAFE_ADDRESS) {
    throw new Error('PRIVATE_KEY and SAFE_ADDRESS required');
  }

  console.log('🔄 Initializing SDK...\n');

  const core = new Core();
  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(RPC_URL),
  });

  const runner = new SafeContractRunner(
    publicClient,
    PRIVATE_KEY,
    RPC_URL,
    SAFE_ADDRESS
  );
  await runner.init();

  const avatar = new HumanAvatar(SAFE_ADDRESS, core, runner);

  console.log('✅ SDK initialized');
  console.log(`   Avatar: ${avatar.address}\n`);

  console.log('🔄 Subscribing to events...\n');
  await avatar.subscribeToEvents();

  avatar.events.subscribe((event) => {
    console.log(`📡 Event: ${event.$event}`);
    console.log(`   Block: ${event.blockNumber}`);
    console.log(`   Data:`, event);
    console.log('');
  });

  console.log('✅ Subscribed. Listening for events...');
  console.log('   Press Ctrl+C to exit\n');

  process.on('SIGINT', () => {
    console.log('\n👋 Unsubscribing...');
    avatar.unsubscribeFromEvents();
    process.exit(0);
  });

  await new Promise(() => {});
}

main().catch(console.error);

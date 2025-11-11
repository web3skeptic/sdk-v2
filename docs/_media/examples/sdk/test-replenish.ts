import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { HumanAvatar } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';
import { CirclesConverter } from '@aboutcircles/sdk-utils';

async function main() {
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;
  const RPC_URL = 'https://rpc.aboutcircles.com/';

  if (!PRIVATE_KEY || !SAFE_ADDRESS) {
    throw new Error('PRIVATE_KEY and SAFE_ADDRESS required');
  }

  const core = new Core();
  const publicClient = createPublicClient({
    chain: gnosis,
    transport: http(RPC_URL),
  });

  const runner = new SafeContractRunner(publicClient, PRIVATE_KEY, RPC_URL, SAFE_ADDRESS);
  await runner.init();

  const avatar = new HumanAvatar(SAFE_ADDRESS, core, runner);

  console.log(`Avatar: ${avatar.address}\n`);

  // Check max replenishable amount
  const maxReplenishable = await avatar.balances.getMaxReplenishable();
  console.log(`Max replenishable: ${CirclesConverter.attoCirclesToCircles(maxReplenishable)} CRC\n`);

  if (maxReplenishable === 0n) {
    console.log('No tokens available to replenish');
    return;
  }

  // Replenish: convert wrapped/other tokens to unwrapped personal CRC
  const receipt = await avatar.balances.replenish();
  console.log(`Replenished successfully: ${receipt.blockHash}`);
}

main().catch(console.error);

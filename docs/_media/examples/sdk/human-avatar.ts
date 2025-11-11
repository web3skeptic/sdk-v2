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
    throw new Error('PRIVATE_KEY and SAFE_ADDRESS environment variables are required');
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
  console.log(`   Avatar Address: ${avatar.address}\n`);

  // Wrapping
  //await avatar.wrap.asDemurraged("0xfc957a6405165ba3396362d3f8e1aee487dabc95", BigInt(10e18));
  //await avatar.wrap.asInflationary(AVATAR_ADDRESS, BigInt(100));

  // Unwrapping
  //await avatar.wrap.unwrapDemurraged("0xB0C18D263D777FAEfDe6D9038bAFCa86B4EB675B", BigInt(5e18));
  //await avatar.wrap.unwrapInflationary(WRAPPER_ADDRESS, BigInt(50));
  // Max Flow
  const result = await avatar.transfer.getMaxAmountAdvanced("0xfc957a6405165ba3396362d3f8e1aee487dabc95", {
    useWrappedBalances: false,
    fromTokens: ["0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b"]
  })
  console.log("Max transfer flow: ", result);
}

main().catch(console.error);

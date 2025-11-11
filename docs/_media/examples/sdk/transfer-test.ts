import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { HumanAvatar } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http } from 'viem';
import { gnosis } from 'viem/chains';
import { CirclesConverter } from '@aboutcircles/sdk-utils';
import { Address } from '@aboutcircles/sdk-types';

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

  // Recipient address
  const recipientAddress = '0x764E314b52681a4dA39b442d399af07Ce46632Ca';

  // Amount to transfer: 8 CRC
  const amountInCircles = 10;
  const amountInAttoCircles = CirclesConverter.circlesToAttoCircles(amountInCircles);

  try {
    const options = {
      fromTokens: [
        "0x62cff728961f4db36cca294cb430ae15025b1f24",
        "0x25f3abed092086cc5d569488d9de9012153f19a4",
        "0xfb4e4ca590b0ea4fdcf1d4764b64052dd599c62a"
      ] as Address[],
      useWrappedBalances: true, // Enable this to use wrapped tokens (ERC20 wrappers)
    };
    // First, check the maximum transferable amount
    console.log('🔍 Checking maximum transferable amount...');
    const maxAmount = await avatar.transfer.getMaxAmountAdvanced(recipientAddress, options);
    console.log(`✅ Maximum transferable amount: ${CirclesConverter.attoCirclesToCircles(maxAmount)} CRC\n`);


    // Perform the advanced transfer
    console.log('🚀 Executing advanced transfer...');

    const receipt = await avatar.transfer.advanced(
      recipientAddress,
      amountInAttoCircles,
      options
    );

    console.log('\n✅ Transfer successful:', receipt.blockHash);
  } catch (error) {
    console.error('\n❌ Transfer failed:', error);
  }
}

main().catch(console.error);

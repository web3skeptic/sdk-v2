// Max is tge best
import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { HumanAvatar } from '@aboutcircles/sdk';
import { SafeContractRunner } from '@aboutcircles/sdk-runner';
import { createPublicClient, http, type PublicClient } from 'viem';
import { gnosis } from 'viem/chains';
import {
  CirclesError,
  ValidationError,
  isCirclesError,
  getErrorMessage,
} from '@aboutcircles/sdk-utils';
import { RpcError, CirclesRpc } from '@aboutcircles/sdk-rpc';
import { ContractError, NetworkError } from '@aboutcircles/sdk-core';
import { SdkError } from '@aboutcircles/sdk';
import { RunnerError } from '@aboutcircles/sdk-runner';

async function demonstrateErrorHandling() {
  console.log('🔍 Circles SDK Error Handling Examples\n');

  // Example 1: RPC Connection Error
  console.log('1️⃣ RPC Connection Error');
  try {
    const invalidRpc = new CirclesRpc('https://invalid-rpc-endpoint.example.com');
    await invalidRpc.avatar.getAvatarInfo('0x0000000000000000000000000000000000000000');
  } catch (error) {
    if (isCirclesError(error)) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Source: ${error.source}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      if (error.context) {
        console.log(`   Context:`, error.context);
      }
    } else {
      console.log(`   Unexpected error: ${getErrorMessage(error)}`);
    }
  }
  console.log('');

  // Example 2: Validation Error - Invalid Address
  console.log('2️⃣ Validation Error - Invalid Address');
  try {
    throw ValidationError.invalidAddress('not-an-address');
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Context:`, error.context);
    }
  }
  console.log('');

  // Example 3: Validation Error - Invalid Amount
  console.log('3️⃣ Validation Error - Invalid Amount');
  try {
    throw ValidationError.invalidAmount(-100, 'Amount must be positive');
  } catch (error) {
    if (error instanceof ValidationError) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Context:`, error.context);
    }
  }
  console.log('');

  // Example 4: Contract Error - Transaction Failed
  console.log('4️⃣ Contract Error - Transaction Failed');
  try {
    throw ContractError.transactionFailed(
      '0x1234567890abcdef',
      'Insufficient balance',
      new Error('Execution reverted')
    );
  } catch (error) {
    if (error instanceof ContractError) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Context:`, error.context);
      if (error.cause instanceof Error) {
        console.log(`   Cause: ${error.cause.message}`);
      }
    }
  }
  console.log('');

  // Example 5: Network Error - Wrong Network
  console.log('5️⃣ Network Error - Wrong Network');
  try {
    throw NetworkError.wrongNetwork(100, 1); // Expected Gnosis, got Ethereum
  } catch (error) {
    if (error instanceof NetworkError) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Context:`, error.context);
    }
  }
  console.log('');

  // Example 6: SDK Error - Not Initialized
  console.log('6️⃣ SDK Error - Not Initialized');
  try {
    throw SdkError.notInitialized('ContractRunner');
  } catch (error) {
    if (error instanceof SdkError) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Context:`, error.context);
    }
  }
  console.log('');

  // Example 6b: Runner Error - Execution Failed
  console.log('6️⃣b Runner Error - Execution Failed');
  try {
    throw RunnerError.executionFailed(
      'Transaction reverted',
      new Error('Insufficient funds')
    );
  } catch (error) {
    if (error instanceof RunnerError) {
      console.log(`   Error: ${error.name}`);
      console.log(`   Message: ${error.message}`);
      console.log(`   Code: ${error.code}`);
      console.log(`   Source: ${error.source}`);
      if (error.cause instanceof Error) {
        console.log(`   Cause: ${error.cause.message}`);
      }
    }
  }
  console.log('');

  // Example 7: Error with full context
  console.log('7️⃣ Detailed Error with Context');
  try {
    throw new RpcError('Failed to fetch avatar data', {
      code: 'RPC_QUERY_FAILED',
      cause: new Error('Network timeout'),
      context: {
        method: 'circles_query',
        avatar: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
        table: 'V_Crc.Avatars',
        timestamp: Date.now(),
      },
    });
  } catch (error) {
    if (error instanceof RpcError) {
      console.log('   Full error details:');
      console.log(JSON.stringify(error.toJSON(), null, 2));
    }
  }
  console.log('');

  // Example 8: Real RPC call with error handling
  console.log('8️⃣ Real RPC Call with Error Handling');
  const PRIVATE_KEY = process.env.PRIVATE_KEY as `0x${string}`;
  const SAFE_ADDRESS = process.env.SAFE_ADDRESS as `0x${string}`;

  if (!PRIVATE_KEY || !SAFE_ADDRESS) {
    console.log('   ⚠️  Skipped - PRIVATE_KEY and SAFE_ADDRESS required');
    return;
  }

  try {
    const core = new Core();
    const publicClient = createPublicClient({
      chain: gnosis,
      transport: http('https://rpc.aboutcircles.com/'),
    }) as PublicClient;

    const runner = new SafeContractRunner(
      publicClient,
      PRIVATE_KEY,
      'https://rpc.aboutcircles.com/',
      SAFE_ADDRESS
    );
    await runner.init();

    const avatar = new HumanAvatar(SAFE_ADDRESS, core, runner);

    // Try to get transaction history
    const transactions = await avatar.history.getTransactions(5);
    console.log(`   ✅ Successfully fetched ${transactions.length} transactions`);
  } catch (error) {
    if (isCirclesError(error)) {
      console.log(`   ❌ Circles Error: ${error.source} - ${error.name}`);
      console.log(`   Message: ${error.message}`);
      if (error.code) {
        console.log(`   Code: ${error.code}`);
      }
    } else {
      console.log(`   ❌ Unexpected error: ${getErrorMessage(error)}`);
    }
  }
}

demonstrateErrorHandling().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});

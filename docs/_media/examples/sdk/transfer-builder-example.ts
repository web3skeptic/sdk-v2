import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { TransferBuilder } from '@aboutcircles/sdk-transfers';
import { CirclesConverter } from '@aboutcircles/sdk-utils';
import { Address } from '@aboutcircles/sdk-types';

/**
 * Example demonstrating the TransferBuilder.constructAdvancedTransfer method
 *
 * This example shows how to construct transfer transactions with wrapped tokens (ERC20)
 * without executing them immediately. The builder handles:
 *
 * 1. Fetching balances and filtering wrapped tokens
 * 2. Creating unwrap calls for ERC20 tokens (demurraged and inflationary)
 * 3. Building the operateFlowMatrix call
 * 4. Creating wrap calls for leftover inflationary tokens
 */
async function main() {
  const RPC_URL = process.env.RPC_URL || 'https://rpc.aboutcircles.com/';
  const CIRCLES_RPC_URL = process.env.CIRCLES_RPC_URL || 'https://rpc.aboutcircles.com/';

  console.log('='.repeat(80));
  console.log('TransferBuilder.constructAdvancedTransfer Example');
  console.log('='.repeat(80));
  console.log();

  // Initialize Core
  console.log('🔄 Initializing Core...');
  const core = new Core({
    rpcUrl: RPC_URL,
    circlesRpcUrl: CIRCLES_RPC_URL,
  });
  console.log('✅ Core initialized\n');

  // Initialize TransferBuilder
  console.log('🔄 Initializing TransferBuilder...');
  const transferBuilder = new TransferBuilder(core);
  console.log('✅ TransferBuilder initialized\n');

  // Example addresses - replace with actual addresses
  const fromAddress = process.env.FROM_ADDRESS as Address || '0x7CadF434b692ca029D950607A4b3F139c30d4e98' as Address;
  const toAddress = process.env.TO_ADDRESS as Address || '0x764E314b52681a4dA39b442d399af07Ce46632Ca' as Address;

  // Amount to transfer: 10 CRC
  const amountInCircles = 10;
  const amountInAttoCircles = CirclesConverter.circlesToAttoCircles(amountInCircles);

  console.log('📊 Transfer Parameters:');
  console.log(`   From: ${fromAddress}`);
  console.log(`   To: ${toAddress}`);
  console.log(`   Amount: ${amountInCircles} CRC (${amountInAttoCircles} attoCircles)`);
  console.log();

  try {
    // Scenario 1: Basic transfer without wrapped tokens
    console.log('━'.repeat(80));
    console.log('Scenario 1: Basic Transfer (no wrapped tokens)');
    console.log('━'.repeat(80));
    console.log();

    const basicOptions = {
      useWrappedBalances: false,
    };

    console.log('🚀 Constructing basic transfer...\n');
    const basicTxs = await transferBuilder.constructAdvancedTransfer(
      fromAddress,
      toAddress,
      amountInAttoCircles,
      basicOptions
    );

    console.log(`\n✅ Basic transfer constructed: ${basicTxs.length} transaction(s)`);
    basicTxs.forEach((tx, index) => {
      console.log(`   ${index + 1}. to: ${tx.to}`);
      console.log(`      data: ${tx.data.substring(0, 66)}...`);
      console.log(`      value: ${tx.value}`);
    });
    console.log();

    // Scenario 2: Advanced transfer with wrapped tokens
    console.log('━'.repeat(80));
    console.log('Scenario 2: Advanced Transfer (with wrapped tokens)');
    console.log('━'.repeat(80));
    console.log();

    const advancedOptions = {
      useWrappedBalances: true, // Enable wrapped ERC20 tokens
      // Optional: exclude specific tokens
      // excludeFromTokens: ['0x...' as Address],
      // Optional: specify which tokens to use
      // fromTokens: ['0x...' as Address],
      // toTokens: ['0x...' as Address],
    };

    console.log('🚀 Constructing advanced transfer with wrapped tokens...\n');
    const advancedTxs = await transferBuilder.constructAdvancedTransfer(
      fromAddress,
      toAddress,
      amountInAttoCircles,
      advancedOptions
    );

    console.log(`\n✅ Advanced transfer constructed: ${advancedTxs.length} transaction(s)`);
    console.log('\n📋 Transaction Details:');
    advancedTxs.forEach((tx, index) => {
      console.log(`\n   Transaction ${index + 1}:`);
      console.log(`      Target: ${tx.to}`);
      console.log(`      Data: ${tx.data.substring(0, 66)}...`);
      console.log(`      Value: ${tx.value}`);

      // Try to identify transaction type
      const dataPrefix = tx.data.substring(0, 10);
      let txType = 'Unknown';
      if (dataPrefix === '0xa22cb465') txType = 'setApprovalForAll';
      else if (dataPrefix === '0xde0e9a3e') txType = 'unwrap';
      else if (dataPrefix === '0xea598cb0') txType = 'wrap';
      else if (dataPrefix.includes('f4f3bdc1')) txType = 'operateFlowMatrix';

      console.log(`      Type: ${txType}`);
    });
    console.log();

    // Scenario 3: Self-transfer unwrap operation
    console.log('━'.repeat(80));
    console.log('Scenario 3: Self-Transfer Unwrap (optimized path)');
    console.log('━'.repeat(80));
    console.log();

    console.log('🚀 Constructing self-transfer unwrap...\n');

    // This would be a wrapped token address owned by the sender
    const wrappedTokenAddress = '0x...' as Address; // Replace with actual wrapper
    const ownTokenAddress = fromAddress; // The underlying token

    const unwrapOptions = {
      useWrappedBalances: true,
      fromTokens: [wrappedTokenAddress],
      toTokens: [ownTokenAddress],
    };

    try {
      const unwrapTxs = await transferBuilder.constructAdvancedTransfer(
        fromAddress,
        fromAddress, // Same address = self-transfer
        amountInAttoCircles,
        unwrapOptions
      );

      console.log(`\n✅ Self-transfer unwrap constructed: ${unwrapTxs.length} transaction(s)`);
      unwrapTxs.forEach((tx, index) => {
        console.log(`   ${index + 1}. to: ${tx.to}`);
        console.log(`      data: ${tx.data.substring(0, 66)}...`);
      });
    } catch (error: any) {
      console.log('⚠️  Self-transfer scenario skipped (may need valid wrapped token)');
      console.log(`   Error: ${error.message}`);
    }
    console.log();

    // Summary
    console.log('━'.repeat(80));
    console.log('Summary');
    console.log('━'.repeat(80));
    console.log();
    console.log('✅ TransferBuilder.constructAdvancedTransfer handles:');
    console.log('   1. Balance fetching and validation');
    console.log('   2. Pathfinding with wrapped token support');
    console.log('   3. Unwrapping ERC20 tokens (demurraged: exact amount, inflationary: full balance)');
    console.log('   4. Flow matrix construction');
    console.log('   5. Wrapping leftover inflationary tokens back');
    console.log();
    console.log('💡 Transaction order:');
    console.log('   1. Self-approval (if needed)');
    console.log('   2. Unwrap calls (for wrapped ERC20 tokens)');
    console.log('   3. operateFlowMatrix (the actual transfer)');
    console.log('   4. Wrap calls (for leftover inflationary tokens)');
    console.log();
    console.log('🎯 These transactions can be:');
    console.log('   - Sent directly to a wallet/signer');
    console.log('   - Batched together in a Safe multisig');
    console.log('   - Executed through any compatible runner');
    console.log();

  } catch (error: any) {
    console.error('\n❌ Error:', error.message);
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    if (error.context) {
      console.error('   Context:', JSON.stringify(error.context, null, 2));
    }
    console.error('\n   Stack:', error.stack);
  }
}

main().catch(console.error);

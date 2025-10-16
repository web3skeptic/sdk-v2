/**
 * Transaction History Examples
 *
 * Demonstrates how to query transaction history for an address
 */

import { CirclesRpc } from '@circles-sdk/rpc';

const TEST_ADDRESS = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';

async function main() {
  const rpc = new CirclesRpc();

  console.log('=== Transaction History Examples ===\n');
  console.log(`Test Address: ${TEST_ADDRESS}\n`);

  // 1. Get recent transaction history
  console.log('1. Getting recent transaction history (limit 10)...');
  const recentTxs = await rpc.transaction.getTransactionHistory(TEST_ADDRESS, 10);
  console.log(`Found ${recentTxs.length} recent transactions`);
  console.log();

  if (recentTxs.length > 0) {
    // Display the first transaction in detail
    const firstTx = recentTxs[0];
    console.log('Most recent transaction:');
    console.log(`  Block: ${firstTx.blockNumber}`);
    console.log(`  Timestamp: ${new Date(firstTx.timestamp * 1000).toISOString()}`);
    console.log(`  From: ${firstTx.from}`);
    console.log(`  To: ${firstTx.to}`);
    console.log(`  Token: ${firstTx.tokenAddress}`);
    console.log(`  Value: ${firstTx.value}`);
    console.log(`  Version: ${firstTx.version}`);
    console.log(`  Tx Hash: ${firstTx.transactionHash}`);
    console.log();

    // 2. Analyze transaction types
    console.log('2. Analyzing transaction types...');
    const incoming = recentTxs.filter(tx => tx.to.toLowerCase() === TEST_ADDRESS.toLowerCase());
    const outgoing = recentTxs.filter(tx => tx.from.toLowerCase() === TEST_ADDRESS.toLowerCase());
    const minting = recentTxs.filter(tx =>
      tx.from === '0x0000000000000000000000000000000000000000' &&
      tx.to.toLowerCase() === TEST_ADDRESS.toLowerCase()
    );

    console.log(`  Incoming: ${incoming.length} transactions`);
    console.log(`  Outgoing: ${outgoing.length} transactions`);
    console.log(`  Minting: ${minting.length} transactions`);
    console.log();

    // 3. Analyze by version
    console.log('3. Analyzing by Circles version...');
    const v1Txs = recentTxs.filter(tx => tx.version === 1);
    const v2Txs = recentTxs.filter(tx => tx.version === 2);

    console.log(`  V1 transactions: ${v1Txs.length}`);
    console.log(`  V2 transactions: ${v2Txs.length}`);
    console.log();
  }

  // 4. Get larger transaction history
  console.log('4. Getting larger transaction history (limit 50)...');
  const allTxs = await rpc.transaction.getTransactionHistory(TEST_ADDRESS, 50);
  console.log(`Found ${allTxs.length} transactions`);

  if (allTxs.length > 0) {
    // Get unique tokens involved
    const uniqueTokens = new Set(allTxs.map(tx => tx.tokenAddress));
    console.log(`  Unique tokens involved: ${uniqueTokens.size}`);

    // Get date range
    const timestamps = allTxs.map(tx => tx.timestamp);
    const oldestTx = new Date(Math.min(...timestamps) * 1000);
    const newestTx = new Date(Math.max(...timestamps) * 1000);
    console.log(`  Date range: ${oldestTx.toISOString()} to ${newestTx.toISOString()}`);
  }
  console.log();

  // 5. Display transaction timeline (last 5)
  console.log('5. Transaction timeline (last 5):');
  recentTxs.slice(0, 5).forEach((tx, index) => {
    const date = new Date(tx.timestamp * 1000).toLocaleString();
    const direction = tx.to.toLowerCase() === TEST_ADDRESS.toLowerCase() ? 'IN' : 'OUT';
    const counterparty = direction === 'IN' ? tx.from : tx.to;

    console.log(`  ${index + 1}. [${direction}] ${date}`);
    console.log(`     ${counterparty} | v${tx.version}`);
  });
}

main().catch(console.error);

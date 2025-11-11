import 'dotenv/config';
import { Core } from '@aboutcircles/sdk-core';
import { CirclesConverter } from '@aboutcircles/sdk-utils';
import type { Address } from '@aboutcircles/sdk-types';

/**
 * Personal Token Mintable Amount Example
 *
 * This example demonstrates:
 * - Checking mintable amounts for a human avatar
 * - Getting issuance details including amount, start period, and end period
 * - Converting between atto-circles and human-readable CRC format
 *
 * Usage:
 * - Set AVATAR_ADDRESS in your .env file (must be a registered human avatar)
 * - Run: bun examples/sdk/personal-token-mintable.ts
 *
 * Example addresses you can try:
 * - 0x764E314b52681a4dA39b442d399af07Ce46632Ca (has ~113 CRC available)
 */

async function main() {
  const AVATAR_ADDRESS = (
    process.env.AVATAR_ADDRESS ||
    '0x764E314b52681a4dA39b442d399af07Ce46632Ca'
  ) as Address;

  console.log('🔄 Initializing Core...\n');

  const core = new Core();

  console.log('✅ Core initialized');
  console.log(`   Avatar Address: ${AVATAR_ADDRESS}\n`);

  try {
    console.log('📊 Fetching personal token issuance information...\n');

    // Call calculateIssuance directly from HubV2 contract
    const [amount, startPeriod, endPeriod] = await core.hubV2.calculateIssuance(AVATAR_ADDRESS);

    // Display results
    console.log('=== Personal Token Issuance ===\n');
    console.log(`Mintable Amount (atto-circles): ${amount.toString()}`);
    console.log(`Mintable Amount (CRC):          ${CirclesConverter.attoCirclesToCircles(amount).toFixed(4)} CRC\n`);
    console.log(`Start Period:                   ${startPeriod.toString()}`);
    console.log(`End Period:                     ${endPeriod.toString()}`);
    console.log(`Period Range:                   ${(endPeriod - startPeriod).toString()} periods\n`);

    // Additional helpful info
    if (amount > 0n) {
      console.log('✅ Tokens are available to mint!');
      console.log(`   You can call avatar.personalToken.mint() to claim ${CirclesConverter.attoCirclesToCircles(amount).toFixed(4)} CRC\n`);
      console.log(`Note: This is equivalent to calling avatar.personalToken.getMintableAmount() in the SDK\n`);
    } else {
      console.log('ℹ️  No tokens available to mint at this time.\n');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message || error);
    throw error;
  }
}

main()
  .then(() => {
    console.log('✅ Example completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Example failed:', error);
    process.exit(1);
  });

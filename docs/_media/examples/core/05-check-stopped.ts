import { Core } from '@aboutcircles/sdk-core';

/**
 * Check Stopped Status Example
 *
 * This example demonstrates how to check if a human has stopped their Circles minting.
 * The 'stopped' function checks if an avatar has called the stop() function.
 *
 * We pass the account address as msg.sender using the options parameter:
 * core.hubV2.stopped(accountAddress, { from: accountAddress })
 */

async function checkStopped() {
  console.log('=== Check Stopped Status Example ===\n');

  const core = new Core();

  // The address to check
  const accountAddress = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';

  console.log('Using RPC:', core.rpcUrl);
  console.log('HubV2 address:', core.config.v2HubAddress);
  console.log('\nChecking stopped status for:', accountAddress);

  try {
    // Check 1: Call without specifying msg.sender (defaults to 0x0...0)
    console.log('\n=== Check 1: Default msg.sender (0x0...0) ===');
    const stoppedDefault = await core.hubV2.stopped(accountAddress);
    console.log('Result:', stoppedDefault);

    // Check 2: Call with the account as msg.sender
    console.log('\n=== Check 2: Using account as msg.sender ===');
    console.log('msg.sender:', accountAddress);
    const stoppedWithSender = await core.hubV2.stopped(accountAddress, { from: accountAddress });
    console.log('Result:', stoppedWithSender);

    // Additional info about the account
    console.log('\n=== Account Information ===');
    const isHuman = await core.hubV2.isHuman(accountAddress);
    console.log('Is Human:', isHuman);

    if (isHuman) {
      console.log('\nThis is a registered human avatar');
      console.log('Stopped status indicates if they have halted their Circles minting');
    }

    console.log('\n=== Summary ===');
    console.log(`Account: ${accountAddress}`);
    console.log(`Type: ${isHuman ? 'Human' : 'Not a human avatar'}`);
    console.log(`Stopped: ${stoppedWithSender}`);

    if (stoppedWithSender) {
      console.log('\n⚠️  This account has stopped minting Circles tokens');
    } else {
      console.log('\n✓ This account is actively minting Circles tokens');
    }

  } catch (error) {
    console.error('\n❌ Error checking stopped status:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

// Run the example
checkStopped();

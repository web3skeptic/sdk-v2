import { Core } from '@circles-sdk/core';

/**
 * Check isHuman Example
 *
 * This example demonstrates how to check if an address is registered as a human
 * in the Circles protocol using the HubV2 contract's isHuman method.
 */

async function checkIsHuman() {
  console.log('=== Check isHuman Example ===\n');

  // Initialize Core SDK with default Gnosis Chain configuration
  const core = new Core();

  console.log('Using RPC:', core.rpcUrl);
  console.log('HubV2 address:', core.config.v2HubAddress);

  // The address we want to check
  const addressToCheck = '0x4E2564e5df6C1Fb10C1A018538de36E4D5844DE5';

  console.log(`\nChecking if ${addressToCheck} is registered as a human...\n`);

  try {
    // Call the isHuman method on the HubV2 contract
    const isHuman = await core.hubV2.isHuman(addressToCheck);

    console.log('Result:', isHuman);
    console.log(`Address ${addressToCheck} is ${isHuman ? '' : 'NOT '}registered as a human`);

    // Additional checks you can perform
    console.log('\n=== Additional Avatar Checks ===\n');

    const [isGroup, isOrganization] = await Promise.all([
      core.hubV2.isGroup(addressToCheck),
      core.hubV2.isOrganization(addressToCheck)
    ]);

    console.log('Is Group:', isGroup);
    console.log('Is Organization:', isOrganization);

    // Summary
    console.log('\n=== Summary ===\n');
    console.log(`Address: ${addressToCheck}`);
    console.log(`Type: ${isHuman ? 'Human' : isGroup ? 'Group' : isOrganization ? 'Organization' : 'Unknown/Not registered'}`);

  } catch (error) {
    console.error('Error checking isHuman:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
    }
  }
}

// Run the example
checkIsHuman();

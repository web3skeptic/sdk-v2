import { Core } from '@circles-sdk/core';

/**
 * HubV2 Contract Examples
 *
 * This example demonstrates how to interact with the HubV2 contract.
 * The HubV2 contract is a singleton that manages the Circles protocol.
 */

const core = new Core();

console.log('=== HubV2 Contract Examples ===\n');

// Example 1: Group Mint
// Creates a group mint transaction for distributing tokens to multiple recipients
console.log('Example 1: Group Mint Transaction\n');

const groupMintTx = core.hubV2.groupMint(
  '0x1234567890123456789012345678901234567890', // group address
  [
    '0x0000000000000000000000000000000000000001', // recipient 1
    '0x0000000000000000000000000000000000000002'  // recipient 2
  ],
  [
    BigInt(100), // amount for recipient 1
    BigInt(200)  // amount for recipient 2
  ],
  '0x' // data (empty)
);

console.log('GroupMint Transaction:', groupMintTx);
console.log('- Group:', groupMintTx.to);
console.log('- Function:', groupMintTx.data.slice(0, 10));
console.log('- Recipients: 2');
console.log('- Total amount:', BigInt(300));

// Example 2: Personal Mint
// Creates a personal mint transaction for an avatar
console.log('\n\nExample 2: Personal Mint Transaction\n');

// Note: This is the data structure - actual method would be:
// core.hubV2.personalMint()
// You would call this on your avatar's token contract to mint new personal tokens
console.log('Personal mint would be called on your avatar token contract');
console.log('to mint new Circles tokens based on the time elapsed since last mint');

// Example 3: Trust Operations
// The HubV2 contract also handles trust relationships between avatars
console.log('\n\nExample 3: Trust Operations\n');

console.log('Trust operations are typically managed through the HubV2 contract');
console.log('to establish which tokens an avatar trusts and will accept');

// Additional examples would include:
// - wrap/unwrap operations
// - transfer operations
// - stopped/unstopped checks
// These require actual wallet integration to execute

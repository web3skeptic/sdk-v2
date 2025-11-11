import { Core, BaseGroupContract } from '@aboutcircles/sdk-core';

/**
 * BaseGroup Contract Examples
 *
 * This example demonstrates:
 * - Creating new BaseGroups using the factory
 * - Interacting with existing BaseGroup instances
 * - Managing trust relationships within groups
 */

const core = new Core();

console.log('=== BaseGroup Examples ===\n');

// Example 1: Create a new BaseGroup using the factory
console.log('Example 1: Create a New BaseGroup\n');

const createGroupTx = core.baseGroupFactory.createBaseGroup(
  '0x0000000000000000000000000000000000000001', // owner
  '0x0000000000000000000000000000000000000002', // service
  '0x0000000000000000000000000000000000000003', // feeCollection
  [], // initial conditions
  'MyGroup', // name
  'MYG', // symbol
  '0x0000000000000000000000000000000000000000000000000000000000000000' // mint policy
);

console.log('CreateGroup Transaction:', createGroupTx);
console.log('- Factory address:', createGroupTx.to);
console.log('- Group name: MyGroup');
console.log('- Group symbol: MYG');
console.log('- Owner: 0x0000000000000000000000000000000000000001');

// Example 2: Interact with an existing BaseGroup
console.log('\n\nExample 2: Interact with Existing BaseGroup\n');

const baseGroup = new BaseGroupContract({
  address: '0x1234567890123456789012345678901234567890', // specific BaseGroup instance
  rpcUrl: core.rpcUrl
});

console.log('BaseGroup instance created for:', baseGroup.address);

// Example 3: Trust members with conditions
console.log('\n\nExample 3: Trust Batch with Conditions\n');

// Calculate expiry timestamp (1 year from now)
const oneYearFromNow = BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60);

const trustBatchTx = baseGroup.trustBatchWithConditions(
  [
    '0x0000000000000000000000000000000000000001', // member 1
    '0x0000000000000000000000000000000000000002'  // member 2
  ],
  oneYearFromNow // expiry timestamp
);

console.log('TrustBatch Transaction:', trustBatchTx);
console.log('- Group address:', trustBatchTx.to);
console.log('- Members to trust: 2');
console.log('- Expiry:', new Date(Number(oneYearFromNow) * 1000).toISOString());

// Example 4: Create multiple BaseGroup instances
console.log('\n\nExample 4: Multiple BaseGroup Instances\n');

const group1 = new BaseGroupContract({
  address: '0x1111111111111111111111111111111111111111',
  rpcUrl: core.rpcUrl
});

const group2 = new BaseGroupContract({
  address: '0x2222222222222222222222222222222222222222',
  rpcUrl: core.rpcUrl
});

console.log('Group 1:', group1.address);
console.log('Group 2:', group2.address);
console.log('\nYou can manage multiple groups simultaneously with different addresses');

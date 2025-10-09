import { Core, circlesConfig, BaseGroupContract } from './index';

/**
 * Example usage of the Core SDK
 *
 * This demonstrates:
 * - Default configuration usage
 * - Custom RPC URL
 * - HubV2 contract access via core.hubV2
 * - BaseGroupFactory for creating groups
 * - BaseGroup contract instances for specific group addresses
 */

// Example 1: Use default Gnosis Chain configuration
const core = new Core();

console.log('Using RPC:', core.rpcUrl);
console.log('HubV2 address:', core.config.v2HubAddress);

// Example 2: Use HubV2 contract (singleton, accessed via core.hubV2)
const groupMintTx = core.hubV2.groupMint(
  '0x1234567890123456789012345678901234567890',
  ['0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002'],
  [BigInt(100), BigInt(200)],
  '0x'
);

console.log('GroupMint Transaction:', groupMintTx);

// Example 3: Create a new BaseGroup using the factory
const createGroupTx = core.baseGroupFactory.createBaseGroup(
  '0x0000000000000000000000000000000000000001', // owner
  '0x0000000000000000000000000000000000000002', // service
  '0x0000000000000000000000000000000000000003', // feeCollection
  [], // initial conditions
  'MyGroup',
  'MYG',
  '0x0000000000000000000000000000000000000000000000000000000000000000'
);

console.log('CreateGroup Transaction:', createGroupTx);

// Example 4: Use BaseGroup contract (multiple instances, create with specific address)
const baseGroup = new BaseGroupContract({
  address: '0x1234567890123456789012345678901234567890', // specific BaseGroup instance
  rpcUrl: core.rpcUrl // reuse the same RPC
});

// Create a transaction to trust members with conditions
const trustBatchTx = baseGroup.trustBatchWithConditions(
  ['0x0000000000000000000000000000000000000001', '0x0000000000000000000000000000000000000002'],
  BigInt(Math.floor(Date.now() / 1000) + 365 * 24 * 60 * 60) // 1 year from now
);

console.log('TrustBatch Transaction:', trustBatchTx);

// Example 5: Use custom RPC URL
const coreCustomRpc = new Core(circlesConfig[100], 'https://custom-rpc.example.com');
console.log('Custom RPC:', coreCustomRpc.rpcUrl);

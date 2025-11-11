import { Core, circlesConfig } from '@aboutcircles/sdk-core';

/**
 * Basic Usage Examples
 *
 * This example demonstrates the fundamental ways to initialize and use the Core SDK.
 */

// Example 1: Use default Gnosis Chain configuration
console.log('=== Example 1: Default Configuration ===\n');

const core = new Core();

console.log('Using RPC:', core.rpcUrl);
console.log('HubV2 address:', core.config.v2HubAddress);
console.log('BaseGroupFactory address:', core.config.baseGroupFactoryAddress);

// Example 2: Use custom RPC URL with default config
console.log('\n=== Example 2: Custom RPC URL ===\n');

const coreCustomRpc = new Core(
  circlesConfig[100], // Gnosis Chain config
  'https://custom-rpc.example.com'
);

console.log('Custom RPC:', coreCustomRpc.rpcUrl);

// Example 3: Access configuration details
console.log('\n=== Example 3: Configuration Details ===\n');

console.log('Available contracts:');
console.log('- HubV2:', core.config.v2HubAddress);
console.log('- BaseGroupFactory:', core.config.baseGroupFactoryAddress);
console.log('- NameRegistry:', core.config.nameRegistryAddress);

// Example 4: Check contract instances are ready to use
console.log('\n=== Example 4: Contract Instances ===\n');

console.log('HubV2 contract ready:', !!core.hubV2);
console.log('BaseGroupFactory ready:', !!core.baseGroupFactory);

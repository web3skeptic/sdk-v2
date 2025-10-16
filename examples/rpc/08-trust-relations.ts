/**
 * Trust Relations Examples
 *
 * Demonstrates how to query trust relations for an address
 */

import { CirclesRpc } from '@circles-sdk/rpc';

const TEST_ADDRESS = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';

async function main() {
  const rpc = new CirclesRpc();

  console.log('=== Trust Relations Examples ===\n');
  console.log(`Test Address: ${TEST_ADDRESS}\n`);

  // 1. Get all v2 trust relations
  console.log('1. Getting all v2 trust relations...');
  const allRelations = await rpc.trust.getTrustRelations(TEST_ADDRESS);
  console.log(`Found ${allRelations.length} trust relations`);
  if (allRelations.length > 0) {
    console.log('First relation:', allRelations[0]);
  }
  console.log();

  // 2. Get aggregated trust relations
  console.log('2. Getting aggregated trust relations...');
  const aggregated = await rpc.trust.getAggregatedTrustRelations(TEST_ADDRESS);
  console.log(`Found ${aggregated.length} aggregated relations`);

  const mutualCount = aggregated.filter(r => r.relation === 'mutuallyTrusts').length;
  const trustsCount = aggregated.filter(r => r.relation === 'trusts').length;
  const trustedByCount = aggregated.filter(r => r.relation === 'trustedBy').length;

  console.log(`- Mutual trusts: ${mutualCount}`);
  console.log(`- Trusts: ${trustsCount}`);
  console.log(`- Trusted by: ${trustedByCount}`);
  console.log();

  // 3. Get addresses that trust this avatar (incoming trust)
  console.log('3. Getting addresses that trust this avatar...');
  const trustedBy = await rpc.trust.getTrustedBy(TEST_ADDRESS);
  console.log(`Found ${trustedBy.length} addresses that trust this avatar`);
  if (trustedBy.length > 0) {
    console.log('First few:', trustedBy.slice(0, 3).map(r => r.objectAvatar));
  }
  console.log();

  // 4. Get addresses that this avatar trusts (outgoing trust)
  console.log('4. Getting addresses that this avatar trusts...');
  const trusts = await rpc.trust.getTrusts(TEST_ADDRESS);
  console.log(`Found ${trusts.length} addresses that this avatar trusts`);
  if (trusts.length > 0) {
    console.log('First few:', trusts.slice(0, 3).map(r => r.objectAvatar));
  }
  console.log();

  // 5. Get mutual trust relations
  console.log('5. Getting mutual trust relations...');
  const mutualTrusts = await rpc.trust.getMutualTrusts(TEST_ADDRESS);
  console.log(`Found ${mutualTrusts.length} mutual trust relations`);
  if (mutualTrusts.length > 0) {
    console.log('First few:', mutualTrusts.slice(0, 3).map(r => r.objectAvatar));
  }
  console.log();

  // 6. Get common trust between two addresses
  const otherAddress = '0xde374ece6fa50e781e81aac78e811b33d16912c7';
  console.log(`6. Getting common trust with ${otherAddress}...`);
  try {
    const commonTrust = await rpc.trust.getCommonTrust(TEST_ADDRESS, otherAddress);
    console.log(`Found ${commonTrust.length} common trusted addresses`);
    if (commonTrust.length > 0) {
      console.log('First few:', commonTrust.slice(0, 5));
    }
  } catch (error) {
    console.log('Error:', error instanceof Error ? error.message : error);
  }
}

main().catch(console.error);

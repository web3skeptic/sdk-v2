#!/usr/bin/env bun
/**
 * Cross-platform publishing script for all SDK packages
 * Publishes packages in dependency order with proper error handling
 */
import { $ } from 'bun';
import { join } from 'path';

// Define packages in dependency order
const packages = [
  'types',           // Base types - no dependencies
  'abis',           // Contract ABIs - depends on types
  'utils',          // Utilities - depends on types
  'profiles',       // Profiles - depends on types, utils
  'core',           // Core SDK - depends on types, abis, utils
  'rpc',            // RPC client - depends on types, utils
  'pathfinder',     // Pathfinder - depends on types, utils
  'transfers',      // Transfers - depends on types, core, pathfinder
  'sdk',            // Main SDK - depends on most packages
  'runner',         // Contract runner - depends on sdk
];

const packagesDir = join(process.cwd(), 'packages');

async function publishPackage(pkg: string): Promise<boolean> {
  const pkgPath = join(packagesDir, pkg);
  console.log(`\n📦 Publishing @aboutcircles/sdk-${pkg}...`);

  try {
    await $`cd ${pkgPath} && bun publish --access public`.quiet();
    console.log(`✅ Published @aboutcircles/sdk-${pkg}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to publish @aboutcircles/sdk-${pkg}`);
    console.error(error);
    return false;
  }
}

async function main() {
  console.log('🚀 Starting publication of all packages...\n');
  console.log('Packages will be published in dependency order:\n');
  console.log(packages.map((p, i) => `  ${i + 1}. @aboutcircles/sdk-${p}`).join('\n'));
  console.log('\n' + '='.repeat(60) + '\n');

  for (const pkg of packages) {
    const success = await publishPackage(pkg);
    if (!success) {
      console.error('\n❌ Publication failed! Stopping process.');
      process.exit(1);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('\n🎉 All packages published successfully!');
}

main();

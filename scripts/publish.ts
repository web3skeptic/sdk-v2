#!/usr/bin/env bun
/**
 * Cross-platform publishing script for all SDK packages
 * Publishes packages in dependency order with proper error handling
 */
import { $ } from 'bun';
import { join } from 'path';

// Define packages in dependency order
const packages = [
  'types',          // Base types - no dependencies
  'abis',           // Contract ABIs - depends on types
  'utils',          // Utilities - depends on types
  'profiles',       // Profiles - depends on types, utils
  'core',           // Core SDK - depends on types, abis, utils
  'rpc',            // RPC client - depends on types, utils
  'pathfinder',     // Pathfinder - depends on types, utils
  'transfers',      // Transfers - depends on types, core, pathfinder
  'runner',         // Contract runner - depends on sdk
  'sdk',            // Main SDK - depends on most packages
];

const packagesDir = join(process.cwd(), 'packages');

async function publishPackage(pkg: string): Promise<boolean> {
  const pkgPath = join(packagesDir, pkg);
  const pkgName = `@aboutcircles/sdk-${pkg}`;
  console.log(`\n📦 Publishing ${pkgName}...`);

  // Read version from package.json
  const pkgJsonPath = join(pkgPath, 'package.json');
  const pkgJson = JSON.parse(await $`cat ${pkgJsonPath}`.text());
  const version = pkgJson.version;

  console.log(`   Version: ${version}`);

  try {
    // Use npm publish for provenance support (Bun doesn't support --provenance yet)
    const result = await $`cd ${pkgPath} && npm publish --access public --provenance 2>&1`;
    console.log(`✅ Published ${pkgName}@${version}`);
    return true;
  } catch (error) {
    // Check if it's a version conflict
    const errorStr = String(error);
    console.log(`Error details: ${errorStr}`);

    if (errorStr.includes('EPUBLISHCONFLICT') || errorStr.includes('cannot publish over previously published version')) {
      console.log(`⚠️  Version ${version} already published, skipping...`);
      return true;
    }

    if (errorStr.includes('E404') || errorStr.includes('404')) {
      console.log(`⚠️  E404 error - this usually means:`);
      console.log(`   1. Package exists but OIDC token is rejected`);
      console.log(`   2. Trusted publisher not configured correctly`);
      console.log(`   3. Check: https://www.npmjs.com/package/${pkgName}/access`);
    }

    // If provenance fails, try without it
    console.log(`⚠️  Provenance failed, retrying without provenance...`);
    try {
      await $`cd ${pkgPath} && npm publish --access public 2>&1`;
      console.log(`✅ Published ${pkgName}@${version} (without provenance)`);
      return true;
    } catch (retryError) {
      const retryErrorStr = String(retryError);
      if (retryErrorStr.includes('EPUBLISHCONFLICT') || retryErrorStr.includes('cannot publish over previously published version')) {
        console.log(`⚠️  Version ${version} already published, skipping...`);
        return true;
      }
      console.error(`❌ Failed to publish ${pkgName}`);
      console.error(`Full error details: ${retryErrorStr}`);
      return false;
    }
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

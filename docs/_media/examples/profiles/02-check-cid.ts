import { Profiles } from '@aboutcircles/sdk-profiles';
import { CID } from 'multiformats/cid';
import { sha256 } from 'multiformats/hashes/sha2';
import { base58btc } from 'multiformats/bases/base58';

/**
 * Check Profile by Hex CID Digest
 *
 * This example demonstrates:
 * - Converting a hex hash digest to CIDv0 format
 * - Retrieving profile data from the pinning service
 */

// The hex CID digest to check (without 0x prefix)
const HEX_DIGEST = '9885BE4E009FE3E32235329D13C0B078D5456BFFEBAA5982301D95F3BC7CB122';

async function checkProfileByCid() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('           CHECK PROFILE BY CID DIGEST');
  console.log('═══════════════════════════════════════════════════════════');
  console.log();
  console.log(`Hex Digest: ${HEX_DIGEST}`);
  console.log();

  try {
    // Convert hex digest to Uint8Array
    const hexDigest = HEX_DIGEST.toLowerCase();
    const digestBytes = new Uint8Array(
      hexDigest.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))
    );

    console.log('Step 1: Converting hex digest to CIDv0 format...');

    // Create a multihash with SHA-256 code (0x12)
    const multihash = {
      code: 0x12, // SHA-256
      digest: digestBytes,
      bytes: new Uint8Array([
        0x12, // SHA-256 code
        0x20, // 32 bytes length
        ...digestBytes
      ])
    };

    // Create CIDv0 from the multihash
    const cid = CID.create(0, 0x70, multihash); // version 0, dag-pb codec (0x70)
    const cidV0String = cid.toString(base58btc);

    console.log(`✓ CIDv0: ${cidV0String}`);
    console.log();

    // Initialize the Profiles client
    const profiles = new Profiles('https://rpc.aboutcircles.com/profiles/');

    console.log('Step 2: Querying profile service...');
    console.log(`URL: https://rpc.aboutcircles.com/profiles/get?cid=${cidV0String}`);
    console.log();

    // Try to get the profile
    const profile = await profiles.get(cidV0String);

    if (profile) {
      console.log('✅ Profile found!');
      console.log('─'.repeat(60));
      console.log();
      console.log('Profile Data:');
      console.log(JSON.stringify(profile, null, 2));
      console.log();

      if (profile.name) {
        console.log(`Name:        ${profile.name}`);
      }
      if (profile.description) {
        console.log(`Description: ${profile.description}`);
      }
      if (profile.location) {
        console.log(`Location:    ${profile.location}`);
      }
      if (profile.imageUrl) {
        console.log(`Image URL:   ${profile.imageUrl}`);
      }
      if (profile.previewImageUrl) {
        console.log(`Preview:     ${profile.previewImageUrl}`);
      }
    } else {
      console.log('❌ No profile found for this CID');
      console.log();
      console.log('This could mean:');
      console.log('  - The CID is not pinned in the profile service');
      console.log('  - The content has been unpinned');
      console.log('  - The CID format is incorrect');
    }

  } catch (error) {
    console.error('❌ Error:', error instanceof Error ? error.message : error);
    console.error();
    console.error('Full error:', error);
  }

  console.log();
  console.log('═══════════════════════════════════════════════════════════');
}

// Run the check
checkProfileByCid().catch(console.error);

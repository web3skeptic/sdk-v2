import { Profiles, type Profile } from '@aboutcircles/sdk-profiles';

/**
 * Profile Pinning Example
 *
 * This example demonstrates:
 * - Creating and pinning a profile to get a CID
 * - Retrieving a profile by its CID
 */

// Initialize the Profiles client
const profiles = new Profiles('https://rpc.aboutcircles.com/profiles/');

// Example 1: Create and pin a profile
async function examplePinProfile() {
  console.log('=== Example 1: Create and Pin a Profile ===\n');

  const profile: Profile = {
    name: 'Alice',
    description: 'Developer and designer',
    location: 'Berlin, Germany',
  };

  console.log('Profile to pin:', JSON.stringify(profile, null, 2));

  try {
    const cid = await profiles.create(profile);
    console.log('\n✓ Profile pinned successfully!');
    console.log('CID:', cid);
    return cid;
  } catch (error) {
    console.error('✗ Failed to pin profile:', error);
    throw error;
  }
}

// Example 2: Get profile by CID
async function exampleGetProfile(cid: string) {
  console.log('\n\n=== Example 2: Get Profile by CID ===\n');

  console.log('Fetching profile with CID:', cid);

  try {
    const profile = await profiles.get(cid);

    if (profile) {
      console.log('\n✓ Profile retrieved successfully!');
      console.log('\nProfile details:');
      console.log('- Name:', profile.name);
      console.log('- Description:', profile.description || 'N/A');
      console.log('- Location:', profile.location || 'N/A');
      if (profile.geoLocation) {
        console.log('- Geo Location:', `[${profile.geoLocation[0]}, ${profile.geoLocation[1]}]`);
      }
      console.log('- Image URL:', profile.imageUrl || 'N/A');
      console.log('- Preview Image URL:', profile.previewImageUrl || 'N/A');
      if (profile.extensions) {
        console.log('- Extensions:', JSON.stringify(profile.extensions, null, 2));
      }
    } else {
      console.log('\n✗ Profile not found');
    }

    return profile;
  } catch (error) {
    console.error('✗ Failed to get profile:', error);
    throw error;
  }
}

// Example 3: Get an existing profile
async function exampleGetExistingProfile() {
  console.log('\n\n=== Example 3: Get Existing Profile ===\n');

  // Using a known CID from the network
  const existingCid = 'Qmb2s3hjxXXcFqWvDDSPCd1fXXa9gcFJd8bzdZNNAvkq9W';
  console.log('Fetching existing profile with CID:', existingCid);

  try {
    const profile = await profiles.get(existingCid);

    if (profile) {
      console.log('\n✓ Profile retrieved successfully!');
      console.log('- Name:', profile.name);
      console.log('- Description:', profile.description || 'N/A');
    } else {
      console.log('\n✗ Profile not found');
    }
  } catch (error) {
    console.error('✗ Failed to get profile:', error);
  }
}

// Run all examples
async function runExamples() {
  try {
    // Create and pin a new profile
    const cid = await examplePinProfile();

    // Get the profile we just created
    await exampleGetProfile(cid);

    // Get an existing profile
    await exampleGetExistingProfile();
  } catch (error) {
    console.error('\nError running examples:', error);
  }
}

// Uncomment to run the examples:
runExamples();

// Export for use in other scripts
export { runExamples };
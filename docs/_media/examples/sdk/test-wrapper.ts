import { Sdk } from '../../packages/sdk/src';

async function main() {
  const sdk = new Sdk();

  // Test with a known avatar address
  const avatarAddress = '0xfc957a6405165ba3396362d3f8e1aee487dabc95' as const;

  const inflationaryWrapper = await sdk.tokens.getDemurragedWrapper(avatarAddress);
  console.log(inflationaryWrapper);

  //const demurragedWrapper = await sdk.tokens.getDemurragedWrapper(avatarAddress);
  //console.log(demurragedWrapper);
}

main().catch(console.error);

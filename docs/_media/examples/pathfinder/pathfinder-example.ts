import { CirclesRpc } from '@aboutcircles/sdk-rpc';
import { createFlowMatrix } from '@aboutcircles/sdk-pathfinder';

/**
 * Pathfinder Example: Find Path and Create Flow Matrix
 *
 * This example demonstrates:
 * - Finding a transfer path between two addresses using RPC
 * - Creating a flow matrix for the operateFlowMatrix contract call
 * - Inspecting the flow matrix structure
 */

const RPC_URL = 'https://rpc.aboutcircles.com/';

async function exampleFindPathAndCreateFlowMatrix() {
  console.log('\n=== Pathfinder Example: Find Path and Create Flow Matrix ===\n');

  // Define the transfer parameters
  const from = '0xDbc166DCD406068B27E0cbBec6C4251F38Da992A';
  const to = '0xc7d3dF890952a327Af94D5Ba6fdC1Bf145188a1b';
  const targetFlow = 100000000000000000000n; // 100 tokens (18 decimals)

  console.log('Finding path...');
  console.log('From:', from);
  console.log('To:', to);
  console.log('Target Flow:', targetFlow.toString(), '(100 tokens)\n');

  try {
    // Step 1: Find the path using the RPC
    const rpc = new CirclesRpc(RPC_URL);
    const pathResult = await rpc.pathfinder.findPath({
      from,
      to,
      targetFlow,
      useWrappedBalances: false
    });

    /*const maxFlow = await rpc.pathfinder.findMaxFlow({
      from,
      to,
      useWrappedBalances: false
    });
    console.log("Max Flow Result: ", maxFlow)*/


    console.log('✓ Path found!\n');
    console.log('- Number of transfers:', pathResult.transfers.length);
    console.log('\nTransfer Steps:');
    pathResult.transfers.forEach((transfer, index) => {
      console.log(`  ${index + 1}. From: ${transfer.from}`);
      console.log(`     To: ${transfer.to}`);
      console.log(`     Token Owner: ${transfer.tokenOwner}`);
      console.log(`     Value: ${transfer.value}`);
      console.log('');
    });

    // Step 2: Create the flow matrix for operateFlowMatrix
    console.log('\n=== Creating Flow Matrix for operateFlowMatrix ===\n');

    // Convert PathResponse format to TransferStep format for createFlowMatrix

    const flowMatrix = createFlowMatrix(
      from,
      to,
      pathResult.maxFlow,
      pathResult.transfers
    );

    console.log('✓ Flow Matrix created!\n');
    console.log('Flow Matrix Structure:');
    console.log(JSON.stringify(flowMatrix, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    , 2));

    console.log('\n\n=== Flow Matrix Details ===\n');
    console.log('Flow Vertices (addresses in the path):');
    flowMatrix.flowVertices.forEach((vertex, index) => {
      console.log(`  [${index}]: ${vertex}`);
    });

    console.log('\nFlow Edges (transfer amounts):');
    flowMatrix.flowEdges.forEach((edge, index) => {
      console.log(`  [${index}]: streamSinkId=${edge.streamSinkId}, amount=${edge.amount}`);
    });

    console.log('\nStreams (routing information):');
    flowMatrix.streams.forEach((stream, index) => {
      console.log(`  [${index}]: sourceCoordinate=${stream.sourceCoordinate}, flowEdgeIds=[${stream.flowEdgeIds.join(', ')}]`);
    });

    console.log('\nPacked Coordinates (hex):');
    console.log(`  ${flowMatrix.packedCoordinates}`);

    console.log('\nSource Coordinate:', flowMatrix.sourceCoordinate);

    console.log('\n\n=== Ready for operateFlowMatrix ===\n');
    console.log('You can now use this flow matrix to call the operateFlowMatrix function:');
    console.log(`
  const tx = await hubV2Contract.operateFlowMatrix(
    flowMatrix.flowVertices,
    flowMatrix.flowEdges,
    flowMatrix.streams,
    flowMatrix.packedCoordinates
  );
    `);

  } catch (error) {
    console.error('Error:', error);
    if (error instanceof Error) {
      console.error('Message:', error.message);
      console.error('Stack:', error.stack);
    }
  }
}

// Run the example
exampleFindPathAndCreateFlowMatrix();

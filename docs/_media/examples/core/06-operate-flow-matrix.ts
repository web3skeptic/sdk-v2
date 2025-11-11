import { Core } from '@aboutcircles/sdk-core';

/**
 * OperateFlowMatrix Example
 *
 * This example demonstrates how to encode transaction call data for the
 * HubV2 operateFlowMatrix function, which executes batch token transfers
 * based on a flow matrix.
 *
 * The flow matrix is a powerful feature that allows complex multi-hop
 * token transfers in a single transaction.
 */

const core = new Core();

console.log('=== OperateFlowMatrix Transaction Encoding ===\n');

// Flow vertices are the addresses involved in the transfer
const flowVertices = [
  '0x764e314b52681a4da39b442d399af07ce46632ca',
  '0xc7d3df890952a327af94d5ba6fdc1bf145188a1b',
] as const;

// Flow edges define the amount and stream sink ID for each transfer
const flowEdges = [
  {
    streamSinkId: 1,
    amount: BigInt('5000000000000000000'), // 5 CRC in wei
  },
  {
    streamSinkId: 2,
    amount: BigInt('5000000000000000000'), // 5 CRC in wei
  },
] as const;

// Streams define the source coordinate, flow edge IDs, and additional data
const streams = [
  {
    sourceCoordinate: 1,
    flowEdgeIds: [0, 1],
    data: '0x' as const,
  },
] as const;

// Packed coordinates contain encoded coordinate information
// Note: This should be a single 0x prefix, not double
const packedCoordinates = '0x000100010000000100010000' as const;

// Create the transaction request with encoded call data
const operateFlowMatrixTx = core.hubV2.operateFlowMatrix(
  flowVertices,
  flowEdges,
  streams,
  packedCoordinates
);

console.log('Transaction Request:');
console.log('-------------------');
console.log('To:', operateFlowMatrixTx.to);
console.log('Value:', operateFlowMatrixTx.value);
console.log('\nEncoded Call Data:');
console.log(operateFlowMatrixTx.data);
console.log('\n');

// Parse the transaction details
console.log('Transaction Details:');
console.log('-------------------');
console.log('Function Selector:', operateFlowMatrixTx.data.slice(0, 10));
console.log('\nFlow Vertices:');
flowVertices.forEach((vertex, index) => {
  console.log(`  [${index}]: ${vertex}`);
});

console.log('\nFlow Edges:');
flowEdges.forEach((edge, index) => {
  console.log(`  [${index}]: StreamSinkId=${edge.streamSinkId}, Amount=${edge.amount}`);
});

console.log('\nStreams:');
streams.forEach((stream, index) => {
  console.log(`  [${index}]: SourceCoordinate=${stream.sourceCoordinate}, FlowEdgeIds=[${stream.flowEdgeIds.join(', ')}], Data=${stream.data}`);
});

console.log('\nPacked Coordinates:', packedCoordinates);

console.log('\n');
console.log('Total Flow Edges:', flowEdges.length);
console.log('Total Amount:', flowEdges.reduce((sum, edge) => sum + edge.amount, BigInt(0)));

// Display the complete encoded transaction data
console.log('\n=== Complete Encoded Call Data ===');
console.log('Copy this data to use in your transaction:\n');
console.log(operateFlowMatrixTx.data);
console.log('\n');

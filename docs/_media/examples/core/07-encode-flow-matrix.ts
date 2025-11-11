import { Core } from '@aboutcircles/sdk-core';

/**
 * Encode OperateFlowMatrix Call Data - Split Batch Example
 *
 * This script encodes the operateFlowMatrix transaction call data
 * to send 10 tokens as TWO batches of 5 tokens each to the receiver.
 * Both flow edges have the same token ID and go to the same receiver,
 * but are delivered in a batch of 2 during the acceptance check.
 */

const core = new Core();

console.log('=== Encoding OperateFlowMatrix Call Data - Split Batch ===\n');

// Flow vertices: sender and receiver
const flowVertices = [
  '0x764e314b52681a4da39b442d399af07ce46632ca', // vertex 0 - receiver
  '0xc7d3df890952a327af94d5ba6fdc1bf145188a1b', // vertex 1 - sender
] as const;

// Two flow edges, both with amount 5 CRC, both part of the same stream
const flowEdges = [
  {
    streamSinkId: 1, // Both edges belong to stream 1
    amount: BigInt('5000000000000000000'), // 5 CRC
  },
  {
    streamSinkId: 1, // Both edges belong to stream 1
    amount: BigInt('5000000000000000000'), // 5 CRC
  },
] as const;

// One stream that batches both flow edges together
const streams = [
  {
    sourceCoordinate: 1, // sender is vertex 1
    flowEdgeIds: [0, 1], // References both flow edges
    data: '0x' as const,
  },
] as const;

// Packed coordinates for 2 flow edges:
// Each flow edge has 3 coordinates (circleId, sender, receiver) = 6 bytes
// Flow edge 0: [1, 1, 0] = circles of vertex 1, sent by vertex 1, to vertex 0
// Flow edge 1: [1, 1, 0] = circles of vertex 1, sent by vertex 1, to vertex 0
// Packed: 0x0001 0001 0000 0001 0001 0000
const packedCoordinates = '0x000100010000000100010000' as const;

// Create the transaction with encoded call data
const tx = core.hubV2.operateFlowMatrix(
  flowVertices,
  flowEdges,
  streams,
  packedCoordinates
);

console.log('Transaction Details:');
console.log('-------------------');
console.log('To:', tx.to);
console.log('Value:', tx.value);
console.log('Function Selector:', tx.data.slice(0, 10));
console.log('\nParameters:');
console.log('- Flow Vertices:', flowVertices.length);
console.log('  [0]:', flowVertices[0], '(receiver)');
console.log('  [1]:', flowVertices[1], '(sender)');
console.log('- Flow Edges:', flowEdges.length, '(split into 2 batches of 5 CRC each)');
console.log('  [0]: streamSinkId=1, amount=5 CRC');
console.log('  [1]: streamSinkId=1, amount=5 CRC');
console.log('- Streams:', streams.length);
console.log('  [0]: sourceCoordinate=1, flowEdgeIds=[0, 1] (batches both edges)');
console.log('- Total Amount:', flowEdges.reduce((sum, edge) => sum + edge.amount, BigInt(0)).toString(), 'wei (10 CRC)');
console.log('\nAcceptance Check Behavior:');
console.log('- The receiver will get ONE acceptance check call');
console.log('- With ids array: [tokenId, tokenId] (same token ID twice)');
console.log('- With amounts array: [5 CRC, 5 CRC]');
console.log('- This allows the receiver to see the transfer as a batch of 2\n');

console.log('\n=== ENCODED CALL DATA ===\n');
console.log(tx.data);
console.log('\n');

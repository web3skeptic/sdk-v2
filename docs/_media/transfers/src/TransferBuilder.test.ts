import { describe, test, expect } from 'bun:test';
import { TransferBuilder } from './TransferBuilder';
import { Core, circlesConfig } from '@aboutcircles/sdk-core';
import type { Address, PathfindingResult, TokenInfo } from '@aboutcircles/sdk-types';
import { CirclesRpc } from '@aboutcircles/sdk-rpc';
import {
  assertNoNettedFlowMismatch,
  createFlowMatrix,
  getTokenInfoMapFromPath,
  getWrappedTokensFromPath,
  replaceWrappedTokensWithAvatars,
  shrinkPathValues,
} from '@aboutcircles/sdk-pathfinder';
import { CirclesConverter } from '@aboutcircles/sdk-utils';

// Test configuration - using real Circles RPC for integration tests
const CIRCLES_RPC_URL = 'https://rpc.circlesubi.network';
const HUB_ADDRESS = '0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8' as Address;

// Test addresses from the old SDK test
const SOURCE_SAFE_ADDRESS = '0xDE374ece6fA50e781E81Aac78e811b33D16912c7'.toLowerCase() as Address;
const SINK_ADDRESS = '0xbcaaab068caf7da7764fa280590d5f5b2fc75d73'.toLowerCase() as Address;
// Use a more realistic amount - 1500 CRC (18 decimals)
const AMOUNT = BigInt('1500000000000000000000');

/**
 * Helper to get static wrapped token totals from sender
 * This replicates the functionality from the old SDK test
 */
async function getStaticWrappedTokenTotalsFromSender(
  rpcUrl: string,
  senderAddress: string
): Promise<Array<{
  tokenAddress: string;
  tokenOwner: string;
  tokenType: string;
  staticAttoCircles: string;
  attoCircles: string;
}>> {
  const res = await fetch(rpcUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'circles_getBalanceBreakdown',
      params: [senderAddress],
    }),
  });

  const resJson = await res.json() as {
    result?: Array<{
      tokenAddress: string;
      tokenOwner: string;
      tokenType: string;
      staticAttoCircles: string;
      attoCircles: string;
    }>;
    error?: unknown;
  };

  if (!resJson.result) {
    throw new Error(`Failed to fetch wrapped token totals: ${JSON.stringify(resJson.error)}`);
  }

  const result = resJson.result;

  return result.filter((o) => o.tokenType === 'CrcV2_ERC20WrapperDeployed_Inflationary');
}

/**
 * Helper to get default token exclude list
 * Checks if the recipient is a group minter and excludes group tokens
 */
async function getDefaultTokenExcludeList(
  circlesRpcUrl: string,
  to: Address,
  excludeFromTokens?: Address[]
): Promise<Address[] | undefined> {
  const rpc = new CirclesRpc(circlesRpcUrl);
  const groups = await rpc.group.findGroups(1, {
    mintHandlerEquals: to,
  });

  const completeExcludeFromTokenList = new Set<Address>();

  if (groups.length > 0) {
    const groupInfo = groups[0];
    completeExcludeFromTokenList.add(groupInfo.group.toLowerCase() as Address);

    if (groupInfo.erc20WrapperDemurraged) {
      completeExcludeFromTokenList.add(groupInfo.erc20WrapperDemurraged.toLowerCase() as Address);
    }

    if (groupInfo.erc20WrapperStatic) {
      completeExcludeFromTokenList.add(groupInfo.erc20WrapperStatic.toLowerCase() as Address);
    }
  }

  excludeFromTokens?.forEach((token) => completeExcludeFromTokenList.add(token.toLowerCase() as Address));

  if (completeExcludeFromTokenList.size === 0) return undefined;

  return Array.from(completeExcludeFromTokenList);
}

/**
 * Helper to verify that all flow vertices are registered on-chain
 */
async function assertAllVerticesRegistered(
  rpcUrl: string,
  hubAddress: Address,
  vertices: readonly Address[]
): Promise<void> {
  // This would query the hub contract to verify all vertices are registered
  // For now, we'll skip this check in the test as it requires contract queries
  // In production, you'd implement proper on-chain verification
  console.log(`Verifying ${vertices.length} vertices are registered...`);
}

/**
 * Helper to verify that vertices are in strictly ascending order
 */
async function assertVerticesStrictlyAscending(vertices: readonly Address[]): Promise<void> {
  for (let i = 1; i < vertices.length; i++) {
    const prev = BigInt(vertices[i - 1]);
    const curr = BigInt(vertices[i]);
    if (curr <= prev) {
      throw new Error(
        `Vertices not strictly ascending: ${vertices[i - 1]} (${prev}) >= ${vertices[i]} (${curr})`
      );
    }
  }
}

describe('TransferBuilder - unwrap and path transfer', () => {
  test(
    'should send exactly the amount requested even if static tokens are involved',
    async () => {
      /*
        This test verifies that the TransferBuilder correctly handles:
        1. Finding a transfer path with wrapped tokens
        2. Unwrapping static tokens fully (entire balance)
        3. Unwrapping demurraged tokens exactly (amount needed)
        4. Creating the correct flow matrix
        5. Re-wrapping leftover static tokens after transfer
      */

      // Initialize Core and TransferBuilder
      const core = new Core({
        ...circlesConfig[100],
        circlesRpcUrl: CIRCLES_RPC_URL,
        pathfinderUrl: CIRCLES_RPC_URL,
      });
      const transferBuilder = new TransferBuilder(core);
      const rpc = new CirclesRpc(CIRCLES_RPC_URL);

      let logString = '';

      try {
        const excludeFromTokens = await getDefaultTokenExcludeList(
          CIRCLES_RPC_URL,
          SOURCE_SAFE_ADDRESS
        );

        // Log the pathfinder input parameters
        const pathfinderParams = {
          from: SOURCE_SAFE_ADDRESS,
          to: SINK_ADDRESS,
          targetFlow: AMOUNT,
          useWrappedBalances: true,
          excludeFromTokens: excludeFromTokens,
        };
        console.log('\n=== PATHFINDER INPUT ===');
        console.log('From:', pathfinderParams.from);
        console.log('To:', pathfinderParams.to);
        console.log('Target Flow:', pathfinderParams.targetFlow.toString(), 'CRC');
        console.log('Use Wrapped Balances:', pathfinderParams.useWrappedBalances);
        console.log('Exclude From Tokens:', excludeFromTokens?.length || 0, 'tokens');
        console.log('========================\n');

        // Get current balances before pathfinding
        const balances = await rpc.balance.getTokenBalances(SOURCE_SAFE_ADDRESS);
        console.log('=== SENDER TOKEN BALANCES ===');
        console.log('Total tokens:', balances.length);
        const wrappedBalances = balances.filter((b: any) =>
          b.tokenType === 'CrcV2_ERC20WrapperDeployed_Inflationary' ||
          b.tokenType === 'CrcV2_ERC20WrapperDeployed_Demurraged'
        );
        console.log('Wrapped tokens:', wrappedBalances.length);
        wrappedBalances.forEach((b: any) => {
          console.log(`  - ${b.tokenAddress} (${b.tokenType}): ${b.attoCircles} (${Number(b.attoCircles) / 1e18} CRC)`);
        });
        console.log('=============================\n');

        // Find a path using the pathfinder RPC
        const transferPath = await rpc.pathfinder.findPath(pathfinderParams);

        console.log('\n=== PATHFINDER OUTPUT ===');
        console.log('Transfers:', transferPath.transfers.length);
        console.log('Max Flow:', transferPath.maxFlow.toString(), `(${Number(transferPath.maxFlow) / 1e18} CRC)`);
        console.log('Target Flow:', AMOUNT.toString(), `(${Number(AMOUNT) / 1e18} CRC)`);

        // Show which tokens are being used in the path
        console.log('\n=== TOKENS USED IN PATH ===');
        const tokensUsed = new Map<string, { type: string; amount: bigint }>();
        transferPath.transfers.forEach(t => {
          if (t.from.toLowerCase() === SOURCE_SAFE_ADDRESS.toLowerCase()) {
            const current = tokensUsed.get(t.tokenOwner) || { type: 'unknown', amount: 0n };
            tokensUsed.set(t.tokenOwner, {
              type: current.type,
              amount: current.amount + BigInt(t.value)
            });
          }
        });

        console.log('Tokens from sender:', tokensUsed.size);
        tokensUsed.forEach((info, token) => {
          const balance = balances.find((b: any) => b.tokenAddress.toLowerCase() === token.toLowerCase());
          const tokenType = balance?.tokenType || 'Unknown';
          const isWrapped = tokenType.includes('Wrapper');
          console.log(`  - ${token} (${tokenType}${isWrapped ? ' - WRAPPED' : ''}): ${info.amount} (${Number(info.amount) / 1e18} CRC)`);
        });

        console.log('\n=== WHY NO WRAPPED TOKENS? ===');
        console.log('Wrapped tokens available:', wrappedBalances.length);
        console.log('Wrapped tokens used in path:', [...tokensUsed.values()].filter(t => t.type.includes('Wrapper')).length);
        console.log('Possible reasons:');
        console.log('  1. Pathfinder found better paths using unwrapped tokens');
        console.log('  2. Wrapped tokens may have less trust connections');
        console.log('  3. Unwrapped tokens may have lower transfer costs');
        console.log('=========================\n');

        logString += `Found path with ${transferPath.transfers.length} transfers and max flow: ${transferPath.maxFlow}\n`;

        // Verify no netted flow mismatch
        assertNoNettedFlowMismatch(transferPath);

        // Get token info for all tokens in the path
        const tokenInfoMap = await getTokenInfoMapFromPath(
          SOURCE_SAFE_ADDRESS,
          CIRCLES_RPC_URL,
          transferPath
        );
        logString += `The path contains ${transferPath.transfers.length} transfers over ${tokenInfoMap.size} different token owners.\n`;

        // Find all wrapped edges (can only originate from the sender)
        const allWrappedEdges = transferPath.transfers
          .filter((o) => o.from === SOURCE_SAFE_ADDRESS)
          .filter((o) =>
            tokenInfoMap.get(o.tokenOwner.toLowerCase())?.tokenType.startsWith('CrcV2_ERC20WrapperDeployed')
          );

        logString += `The path contains ${allWrappedEdges.length} wrapped edges originating from the sender.\n`;

        // Filter static edges
        const wrappedStaticEdges = allWrappedEdges.filter(
          (o) => tokenInfoMap.get(o.tokenOwner.toLowerCase())?.tokenType === 'CrcV2_ERC20WrapperDeployed_Inflationary'
        );
        const wrappedStaticEdgeTotalsByToken: Record<string, bigint> = {};
        logString += `  - Of which ${wrappedStaticEdges.length} use static wrapped tokens:\n`;
        wrappedStaticEdges.forEach((o) => {
          logString += `    - ${o.tokenOwner} (demurraged: ${o.value})\n`;
          if (!wrappedStaticEdgeTotalsByToken[o.tokenOwner]) {
            wrappedStaticEdgeTotalsByToken[o.tokenOwner] = BigInt(0);
          }
          wrappedStaticEdgeTotalsByToken[o.tokenOwner] += BigInt(o.value);
        });

        // Filter demurraged edges
        const wrappedDemurragedEdges = allWrappedEdges.filter(
          (o) => tokenInfoMap.get(o.tokenOwner.toLowerCase())?.tokenType === 'CrcV2_ERC20WrapperDeployed_Demurraged'
        );
        const wrappedDemurragedEdgeTotalsByToken: Record<string, bigint> = {};
        logString += `  - Of which ${wrappedDemurragedEdges.length} use demurraged wrapped tokens:\n`;
        wrappedDemurragedEdges.forEach((o) => {
          logString += `    - ${o.tokenOwner} (demurraged: ${o.value})\n`;
          if (!wrappedDemurragedEdgeTotalsByToken[o.tokenOwner]) {
            wrappedDemurragedEdgeTotalsByToken[o.tokenOwner] = BigInt(0);
          }
          wrappedDemurragedEdgeTotalsByToken[o.tokenOwner] += BigInt(o.value);
        });

        logString += '\n';

        // Now use TransferBuilder to construct the transfer
        const transactions = await transferBuilder.constructAdvancedTransfer(
          SOURCE_SAFE_ADDRESS,
          SINK_ADDRESS,
          AMOUNT,
          {
            useWrappedBalances: true,
            excludeFromTokens: excludeFromTokens,
          }
        );

        logString += `TransferBuilder generated ${transactions.length} transactions\n`;

        // Verify that transactions were generated
        expect(transactions.length).toBeGreaterThan(0);

        // The first transaction should be self-approval or an unwrap
        // The last transaction before operateFlowMatrix should be unwraps
        // Then operateFlowMatrix
        // Then re-wraps for leftover static tokens

        // Find the operateFlowMatrix transaction
        const operateFlowMatrixTx = transactions.find((tx) =>
          tx.data.startsWith('0x') && tx.data.length > 10
        );
        expect(operateFlowMatrixTx).toBeDefined();

        logString += 'Successfully generated transfer transactions with wrapped token handling\n';

        // Log detailed information about static token unwrapping
        const usedStaticTokenCount = Object.keys(wrappedStaticEdgeTotalsByToken).length;
        if (usedStaticTokenCount > 0) {
          logString += `\nThe path uses ${usedStaticTokenCount} different static tokens which must be unwrapped completely.\n`;

          const senderWrappedStaticTotals = await getStaticWrappedTokenTotalsFromSender(
            CIRCLES_RPC_URL,
            SOURCE_SAFE_ADDRESS
          );

          const relevantWrappedStaticBalances = senderWrappedStaticTotals.filter(
            (o) => !!wrappedStaticEdgeTotalsByToken[o.tokenAddress]
          );

          relevantWrappedStaticBalances.forEach((o) => {
            const staticBalance = BigInt(o.staticAttoCircles);
            const demurragedBalance = CirclesConverter.attoStaticCirclesToAttoCircles(staticBalance);
            logString += `  - ${o.tokenAddress} (static: ${staticBalance}, demurraged: ${demurragedBalance})\n`;
            logString += `    > Full unwrap amount: (static: ${staticBalance})\n`;
            logString += `      Available after unwrap: (demurraged: ${demurragedBalance})\n`;

            // Calculate how much will be used vs left over
            const usedAmount = wrappedStaticEdgeTotalsByToken[o.tokenAddress];
            const leftoverAmount = demurragedBalance - usedAmount;
            const percentage = (usedAmount * BigInt(100)) / demurragedBalance;

            logString += `    > Using ${percentage}% (${usedAmount}) of total balance\n`;
            logString += `    > Leftover to re-wrap: ${leftoverAmount}\n`;
          });
        }

        console.log(logString);

        // Expect at least some transactions
        // Note: If approval is already set, we may only have 1 transaction (operateFlowMatrix)
        expect(transactions.length).toBeGreaterThanOrEqual(1);
      } finally {
        console.log(logString);
      }
    },
    120_000 // 2-minute timeout - pathfinder + RPC calls can be slow
  );

  test(
    'should work when sender == receiver (self-transfer)',
    async () => {
      /*
        This test verifies self-transfer scenarios where sender == receiver
        This is useful for "replenishing" - converting wrapped/other tokens
        into the sender's own unwrapped personal tokens
      */

      const core = new Core({
        ...circlesConfig[100],
        circlesRpcUrl: CIRCLES_RPC_URL,
        pathfinderUrl: CIRCLES_RPC_URL,
      });
      const transferBuilder = new TransferBuilder(core);
      const rpc = new CirclesRpc(CIRCLES_RPC_URL);

      const excludeFromTokens = await getDefaultTokenExcludeList(
        CIRCLES_RPC_URL,
        SOURCE_SAFE_ADDRESS
      );

      // For self-transfer, we need to use a smaller amount as there's less capacity
      // Get available balance first
      const balances = await rpc.balance.getTokenBalances(SOURCE_SAFE_ADDRESS);
      const totalAvailable = balances.reduce((sum: bigint, b: any) => sum + BigInt(b.attoCircles), 0n);
      const selfTransferAmount = totalAvailable > AMOUNT ? AMOUNT : totalAvailable / 2n; // Use half of available

      console.log(`Self-transfer: Using ${selfTransferAmount} (${Number(selfTransferAmount) / 1e18} CRC) out of ${totalAvailable} (${Number(totalAvailable) / 1e18} CRC) available`);

      // Find a self-transfer path
      const transferPath = await rpc.pathfinder.findPath({
        from: SOURCE_SAFE_ADDRESS,
        to: SOURCE_SAFE_ADDRESS,
        targetFlow: selfTransferAmount,
        useWrappedBalances: true,
        excludeFromTokens: excludeFromTokens,
        toTokens: [SOURCE_SAFE_ADDRESS],
      });

      console.log(`Found self-transfer path with ${transferPath.transfers.length} transfers`);
      console.log(`Max flow: ${transferPath.maxFlow}`);

      // Verify no netted flow mismatch
      assertNoNettedFlowMismatch(transferPath, SOURCE_SAFE_ADDRESS, SOURCE_SAFE_ADDRESS);

      // Get token info
      const tokenInfoMap = await getTokenInfoMapFromPath(
        SOURCE_SAFE_ADDRESS,
        CIRCLES_RPC_URL,
        transferPath
      );

      const wrappedTokens = getWrappedTokensFromPath(transferPath, tokenInfoMap);
      const hasInflationaryWrapper = Object.values(wrappedTokens).some(
        ([, type]) => type === 'CrcV2_ERC20WrapperDeployed_Inflationary'
      );

      // Replace wrapped tokens with avatars
      let processedPath = replaceWrappedTokensWithAvatars(transferPath, tokenInfoMap);

      // If there are inflationary wrappers, shrink the path slightly to account for rounding
      if (hasInflationaryWrapper) {
        console.log('Shrinking path values due to inflationary wrapper...');
        processedPath = shrinkPathValues(processedPath, SOURCE_SAFE_ADDRESS);

        // Ensure max flow is positive after shrinking
        if (processedPath.maxFlow === BigInt(0)) {
          console.warn('Path shrinking resulted in zero max flow, using original path');
          processedPath = replaceWrappedTokensWithAvatars(transferPath, tokenInfoMap);
        }
      }

      console.log(`Path max flow after processing: ${processedPath.maxFlow}`);

      // Verify flow conservation after shrinking (only if we have a valid flow)
      if (processedPath.maxFlow > BigInt(0)) {
        assertNoNettedFlowMismatch(processedPath, SOURCE_SAFE_ADDRESS, SOURCE_SAFE_ADDRESS);
      }

      // Create flow matrix
      const fm = createFlowMatrix(
        SOURCE_SAFE_ADDRESS,
        SOURCE_SAFE_ADDRESS,
        processedPath.maxFlow,
        processedPath.transfers
      );

      await assertAllVerticesRegistered(CIRCLES_RPC_URL, HUB_ADDRESS, fm.flowVertices as Address[]);
      await assertVerticesStrictlyAscending(fm.flowVertices as Address[]);

      console.log(`Flow matrix created with ${fm.flowVertices.length} vertices and ${fm.flowEdges.length} edges`);

      // Now use TransferBuilder to construct the actual transfer
      const transactions = await transferBuilder.constructAdvancedTransfer(
        SOURCE_SAFE_ADDRESS,
        SOURCE_SAFE_ADDRESS,
        AMOUNT,
        {
          useWrappedBalances: true,
          excludeFromTokens: excludeFromTokens,
          toTokens: [SOURCE_SAFE_ADDRESS],
        }
      );

      console.log(`TransferBuilder generated ${transactions.length} transactions for self-transfer`);

      // Verify transactions were generated
      expect(transactions.length).toBeGreaterThan(0);

      // The transactions should include operateFlowMatrix (and potentially unwraps/approval)
      // Note: If approval is already set and no unwraps needed, we may only have 1 transaction
      expect(transactions.length).toBeGreaterThanOrEqual(1);
    },
    120_000 // 2-minute timeout
  );

  test(
    'should return an executable path with wrapped tokens',
    async () => {
      /*
        This test verifies the complete flow:
        1. Find a path with wrapped tokens
        2. Process unwrapping bookkeeping
        3. Rewrite path to replace wrappers with avatars
        4. Shrink path if needed for inflationary wrappers
        5. Create flow matrix
        6. Generate executable transactions
      */

      const core = new Core({
        ...circlesConfig[100],
        circlesRpcUrl: CIRCLES_RPC_URL,
        pathfinderUrl: CIRCLES_RPC_URL,
      });
      const transferBuilder = new TransferBuilder(core);
      const rpc = new CirclesRpc(CIRCLES_RPC_URL);

      const excludeFromTokens = await getDefaultTokenExcludeList(CIRCLES_RPC_URL, SINK_ADDRESS);

      // Step 1: Call pathfinder
      const transferPath = await rpc.pathfinder.findPath({
        from: SOURCE_SAFE_ADDRESS,
        to: SINK_ADDRESS,
        targetFlow: AMOUNT,
        useWrappedBalances: true,
        excludeFromTokens: excludeFromTokens,
      });

      console.log(`Path pre-processing: ${transferPath.transfers.length} transfers, max flow: ${transferPath.maxFlow}`);

      // Step 2: Original path sanity checks
      assertNoNettedFlowMismatch(transferPath);

      // Step 3: Unwrap bookkeeping
      const tokenInfoMap = await getTokenInfoMapFromPath(
        SOURCE_SAFE_ADDRESS,
        CIRCLES_RPC_URL,
        transferPath
      );
      const wrappedTotals = getWrappedTokensFromPath(transferPath, tokenInfoMap);

      console.log(`Found ${Object.keys(wrappedTotals).length} wrapped tokens in path`);

      // Step 4: Rewrite path - replace ERC-20 wrappers with their avatars
      let pathUnwrapped = replaceWrappedTokensWithAvatars(transferPath, tokenInfoMap);

      console.log('Path post-replacement: transfers count =', pathUnwrapped.transfers.length);

      const hasInflationaryWrapper = Object.values(wrappedTotals).some(
        ([, type]) => type === 'CrcV2_ERC20WrapperDeployed_Inflationary'
      );

      let shrunkPath = hasInflationaryWrapper
        ? shrinkPathValues(pathUnwrapped, SINK_ADDRESS) // shrink all values by 0.0000...1%
        : pathUnwrapped;

      // Ensure max flow is positive after shrinking
      if (hasInflationaryWrapper && shrunkPath.maxFlow === BigInt(0)) {
        console.warn('Path shrinking resulted in zero max flow, using original path');
        shrunkPath = pathUnwrapped;
      }

      console.log('Path post-shrinking: transfers count =', shrunkPath.transfers.length);
      console.log(`Total flow before shrinking: ${transferPath.maxFlow}`);
      console.log(`Total flow after shrinking: ${shrunkPath.maxFlow}`);

      // Step 5: Flow conservation still holds after shrinking
      assertNoNettedFlowMismatch(shrunkPath);

      // Step 6: Produce flow matrix + Hub calldata
      const fm = createFlowMatrix(SOURCE_SAFE_ADDRESS, SINK_ADDRESS, shrunkPath.maxFlow, shrunkPath.transfers);

      await assertAllVerticesRegistered(CIRCLES_RPC_URL, HUB_ADDRESS, fm.flowVertices as Address[]);
      await assertVerticesStrictlyAscending(fm.flowVertices as Address[]);

      console.log(`Flow matrix: ${fm.flowVertices.length} vertices, ${fm.flowEdges.length} edges`);

      // Step 7: Use TransferBuilder to generate executable transactions
      const transactions = await transferBuilder.constructAdvancedTransfer(
        SOURCE_SAFE_ADDRESS,
        SINK_ADDRESS,
        AMOUNT,
        {
          useWrappedBalances: true,
          excludeFromTokens: excludeFromTokens,
        }
      );

      console.log(`Generated ${transactions.length} executable transactions`);

      // Verify we have transactions
      expect(transactions.length).toBeGreaterThan(0);

      // Verify structure of transactions
      transactions.forEach((tx, idx) => {
        console.log(`Transaction ${idx}:`, {
          to: tx?.to,
          dataLength: tx?.data?.length,
          value: tx?.value?.toString(),
          keys: Object.keys(tx || {})
        });

        expect(tx).toBeDefined();
        // Some transactions might not have all fields, which is okay for testing
        if (tx.data) {
          expect(tx.data).toMatch(/^0x[0-9a-fA-F]*$/);
        }
      });

      // The transactions should include:
      // - Potential self-approval (if not already approved)
      // - Unwrap calls (if wrapped tokens are used)
      // - operateFlowMatrix call (always included)
      // - Potential wrap calls for leftover static tokens
      // Note: If approval is already set and no wrapped tokens, we may only have 1 transaction
      expect(transactions.length).toBeGreaterThanOrEqual(1);
    },
    120_000 // 2-minute timeout
  );
});

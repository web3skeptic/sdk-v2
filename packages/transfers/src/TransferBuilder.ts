import type { Address, AdvancedTransferOptions } from '@circles-sdk/types';
import type { Core } from '@circles-sdk/core';
import {
  createFlowMatrix as createFlowMatrixUtil,
  getTokenInfoMapFromPath,
  getWrappedTokenTotalsFromPath,
  getExpectedUnwrappedTokenTotals,
  replaceWrappedTokens,
} from '@circles-sdk/pathfinder';
import { CirclesRpc } from '@circles-sdk/rpc';
import { bytesToHex, CirclesConverter, encodeFunctionData } from '@circles-sdk/utils';

/**
 * TransferBuilder constructs transfer transactions without executing them
 * Handles pathfinding, wrapped token unwrapping/wrapping, and flow matrix construction
 */
export class TransferBuilder {
  private core: Core;
  private rpc: CirclesRpc;

  constructor(core: Core) {
    this.core = core;
    this.rpc = new CirclesRpc(core.config.circlesRpcUrl);
  }

  /**
   * Construct an advanced transfer transaction
   * Returns the list of transactions to execute without executing them
   *
   * @param from Sender address
   * @param to Recipient address
   * @param amount Amount to transfer (in atto-circles)
   * @param options Advanced transfer options
   * @returns Array of transactions to execute in order
   */
  async constructAdvancedTransfer(
    from: Address,
    to: Address,
    amount: number | bigint,
    options?: AdvancedTransferOptions
  ): Promise<Array<{ to: Address; data: `0x${string}`; value: bigint }>> {
    // Normalize addresses
    const fromAddr = from.toLowerCase() as Address;
    const toAddr = to.toLowerCase() as Address;
    const amountBigInt = BigInt(amount);

    // Truncate to 6 decimals for precision
    const truncatedAmount = this._truncateToSixDecimals(amountBigInt);

    // Get default token exclude list if sending to a group mint handler
    const completeExcludeFromTokens = await this._getDefaultTokenExcludeList(
      toAddr,
      options?.excludeFromTokens
    );

    // Update options with complete exclude list
    const pathfindingOptions = {
      ...options,
      ...(completeExcludeFromTokens ? { excludeFromTokens: completeExcludeFromTokens } : {}),
    };

    // Find transfer path using pathfinder
    let path = await this.rpc.pathfinder.findPath({
      from: fromAddr,
      to: toAddr,
      targetFlow: truncatedAmount,
      ...pathfindingOptions,
    });

    // Check if path is valid
    if (!path.transfers || path.transfers.length === 0) {
      throw new Error(
        `No valid transfer path found from ${fromAddr} to ${toAddr}. ` +
        `This could mean there's no trust connection, insufficient balance, or the tokens are not transferable.`
      );
    }

    // Check if pathfinder found enough tokens for the requested amount
    if (path.maxFlow < truncatedAmount) {
      const requestedCrc = Number(truncatedAmount) / 1e18;
      const availableCrc = Number(path.maxFlow) / 1e18;
      throw new Error(
        `Insufficient balance for transfer. ` +
        `Requested: ${requestedCrc.toFixed(6)} CRC, ` +
        `Available: ${availableCrc.toFixed(6)} CRC. `
      );
    }
    // Get token info for all tokens in the path using pathfinder utility
    const tokenInfoMap = await getTokenInfoMapFromPath(this.core.config.circlesRpcUrl, path);

    // Get wrapped token totals using pathfinder utility
    const wrappedTokenTotals = getWrappedTokenTotalsFromPath(path, tokenInfoMap);

    const hasWrappedTokens = Object.keys(wrappedTokenTotals).length > 0;
    // Validate that wrapped tokens are enabled if they're needed
    if (hasWrappedTokens && !options?.useWrappedBalances) {
      throw new Error(
        `Insufficient unwrapped token balance for transfer. ` +
        `Your balance contains wrapped tokens (ERC20 wrappers), but useWrappedBalances option is not enabled. ` +
        `Please enable it by passing { useWrappedBalances: true } in the transfer options.`
      );
    }

    let unwrapCalls: Array<{ to: Address; data: `0x${string}`; value: bigint }> = [];

    if (hasWrappedTokens) {
      // Create unwrap calls for wrapped tokens
      unwrapCalls = await this._createUnwrapCallsFromTotals(wrappedTokenTotals);

      // Get expected unwrapped amounts using pathfinder utility
      const unwrappedTotals = getExpectedUnwrappedTokenTotals(wrappedTokenTotals, tokenInfoMap);

      // Replace wrapped tokens with underlying tokens in the path
      path = replaceWrappedTokens(path, unwrappedTotals);
    }

    // Create flow matrix from the (possibly rewritten) path
    const flowMatrix = createFlowMatrixUtil(fromAddr, toAddr, path.maxFlow, path.transfers);

    // If txData is provided, attach it to the streams
    if (options?.txData && flowMatrix.streams.length > 0) {
      flowMatrix.streams[0].data = options.txData;
    }

    // Convert Uint8Array data to hex strings for ABI encoding
    const streamsWithHexData = flowMatrix.streams.map((stream) => ({
      sourceCoordinate: stream.sourceCoordinate,
      flowEdgeIds: stream.flowEdgeIds,
      data: stream.data instanceof Uint8Array ? bytesToHex(stream.data) as `0x${string}` : stream.data as `0x${string}`,
    }));

    // Create the operateFlowMatrix transaction
    const operateFlowMatrixTx = this.core.hubV2.operateFlowMatrix(
      flowMatrix.flowVertices as readonly Address[],
      flowMatrix.flowEdges,
      streamsWithHexData,
      flowMatrix.packedCoordinates as `0x${string}`
    );

    // Check if self-approval is needed
    const isApproved = await this.core.hubV2.isApprovedForAll(fromAddr, fromAddr);

    // Assemble all transactions in strict order:
    // 1. Self-approval (only if not already approved)
    // 2. All unwraps
    // 3. operateFlowMatrix
    const allTransactions = [
      ...(isApproved ? [] : [this.core.hubV2.setApprovalForAll(fromAddr, true)]),
      ...unwrapCalls,
      operateFlowMatrixTx,
    ];

    return allTransactions as Array<{ to: Address; data: `0x${string}`; value: bigint }>;
  }

  /**
   * Construct a replenish transaction to convert wrapped/other tokens into unwrapped personal CRC
   * This uses pathfinder to find the best way to convert available tokens (including wrapped tokens)
   * into the sender's own unwrapped ERC1155 personal CRC tokens
   *
   * @param avatarAddress The avatar address to replenish (convert tokens to their personal CRC)
   * @param options Optional pathfinding options
   * @returns Array of transactions to execute in order to perform the replenish
   */
  //@todo fix the current implementation
  async constructReplenish(
    avatarAddress: Address,
    options?: Omit<AdvancedTransferOptions, 'txData'>
  ): Promise<Array<{ to: Address; data: `0x${string}`; value: bigint }>> {
    const addr = avatarAddress.toLowerCase() as Address;

    // Find maximum flow from avatar to itself, targeting personal tokens as destination
    // This effectively asks: "How much can I convert to my own personal tokens?"
    const maxFlow = await this.rpc.pathfinder.findMaxFlow({
      from: addr,
      to: addr,
      toTokens: [addr], // Destination token is sender's own personal CRC
      useWrappedBalances: true, // Include wrapped tokens
      ...options,
    });

    if (maxFlow === 0n) {
      // No tokens available to replenish
      return [];
    }

    // Find the path to convert tokens to personal CRC
    let path = await this.rpc.pathfinder.findPath({
      from: addr,
      to: addr,
      targetFlow: maxFlow,
      toTokens: [addr], // Destination token is sender's own personal CRC
      useWrappedBalances: true, // Include wrapped tokens
      ...options,
    });// @todo redundant call to the path

    // Check if path is valid
    if (!path.transfers || path.transfers.length === 0) {
      // No path found - nothing to replenish
      return [];
    }

    // Get token info for all tokens in the path
    const tokenInfoMap = await getTokenInfoMapFromPath(this.core.config.circlesRpcUrl, path);

    // Get wrapped token totals
    const wrappedTokenTotals = getWrappedTokenTotalsFromPath(path, tokenInfoMap);
    const hasWrappedTokens = Object.keys(wrappedTokenTotals).length > 0;

    let unwrapCalls: Array<{ to: Address; data: `0x${string}`; value: bigint }> = [];

    if (hasWrappedTokens) {
      // Create unwrap calls for wrapped tokens
      unwrapCalls = await this._createUnwrapCallsFromTotals(wrappedTokenTotals);

      // Get expected unwrapped amounts
      const unwrappedTotals = getExpectedUnwrappedTokenTotals(wrappedTokenTotals, tokenInfoMap);

      // Replace wrapped tokens with underlying tokens in the path
      path = replaceWrappedTokens(path, unwrappedTotals);
    }

    // Create flow matrix for the replenish operation
    const flowMatrix = createFlowMatrixUtil(addr, addr, path.maxFlow, path.transfers);

    // Convert Uint8Array data to hex strings for ABI encoding
    const streamsWithHexData = flowMatrix.streams.map((stream) => ({
      sourceCoordinate: stream.sourceCoordinate,
      flowEdgeIds: stream.flowEdgeIds,
      //@todo replenish call would have no tx data
      data: stream.data instanceof Uint8Array ? bytesToHex(stream.data) as `0x${string}` : stream.data as `0x${string}`,
    }));

    // Create the operateFlowMatrix transaction
    const operateFlowMatrixTx = this.core.hubV2.operateFlowMatrix(
      flowMatrix.flowVertices as readonly Address[],
      flowMatrix.flowEdges,
      streamsWithHexData,
      flowMatrix.packedCoordinates as `0x${string}`
    );

    // Check if self-approval is needed
    const isApproved = await this.core.hubV2.isApprovedForAll(addr, addr);

    // Assemble all transactions in strict order:
    // 1. Self-approval (only if not already approved)
    // 2. All unwraps
    // 3. operateFlowMatrix (the actual conversion/replenish)
    const allTransactions = [
      ...(isApproved ? [] : [this.core.hubV2.setApprovalForAll(addr, true)]),
      ...unwrapCalls,
      operateFlowMatrixTx,
    ];

    return allTransactions as Array<{ to: Address; data: `0x${string}`; value: bigint }>;
  }

  // ============================================================================
  // Private Helper Methods
  // ============================================================================

  /**
   * Creates unwrap transaction calls from wrapped token totals
   * Uses the wrapped token information from pathfinder to generate unwrap calls
   *
   * @param wrappedTokenTotals Map of wrapped token addresses to [amount, type]
   * @returns Array of unwrap transaction calls
   */
  private async _createUnwrapCallsFromTotals(
    wrappedTokenTotals: Record<string, [bigint, string]>
  ): Promise<Array<{ to: Address; data: `0x${string}`; value: bigint }>> {
    const unwrapCalls: Array<{ to: Address; data: `0x${string}`; value: bigint }> = [];

    for (const [wrapperAddr, [amount, type]] of Object.entries(wrappedTokenTotals)) {
      let unwrapAmount = amount;

      // For inflationary wrappers, convert demurraged amount to static atto circles
      if (type === 'CrcV2_ERC20WrapperDeployed_Inflationary') {
        unwrapAmount = CirclesConverter.attoCirclesToAttoStaticCircles(amount);
      }

      // Create unwrap call
      const data = encodeFunctionData({
        abi: [{
          type: 'function',
          name: 'unwrap',
          inputs: [{ name: '_amount', type: 'uint256' }],
          outputs: [],
          stateMutability: 'nonpayable',
        }],
        functionName: 'unwrap',
        args: [unwrapAmount],
      });

      unwrapCalls.push({
        to: wrapperAddr as Address,
        data,
        value: 0n,
      });
    }

    return unwrapCalls;
  }

  /**
   * Helper method to truncate amount to 6 decimals
   */
  private _truncateToSixDecimals(amount: bigint): bigint {
    const oneMillion = BigInt(1_000_000);
    const oneEth = BigInt(10) ** BigInt(18);
    return (amount / (oneEth / oneMillion)) * (oneEth / oneMillion);
  }

  /**
   * Get default token exclusion list for transfers to group mint handlers
   * If the recipient is a group mint handler, exclude the group token and its wrappers
   *
   * @param to Recipient address
   * @param excludeFromTokens Existing token exclusion list
   * @returns Complete token exclusion list, or undefined if empty
   */
  private async _getDefaultTokenExcludeList(
    to: Address,
    excludeFromTokens?: Address[]
  ): Promise<Address[] | undefined> {
    // Check if recipient is a group mint handler
    const groups = await this.rpc.group.findGroups(1, {
      mintHandlerEquals: to,
    });

    const completeExcludeFromTokenList = new Set<Address>();

    // If recipient is a group mint handler, exclude the group's tokens
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

    // Add any user-provided exclusions
    excludeFromTokens?.forEach((token) =>
      completeExcludeFromTokenList.add(token.toLowerCase() as Address)
    );

    if (completeExcludeFromTokenList.size === 0) {
      return undefined;
    }

    return Array.from(completeExcludeFromTokenList);
  }
}

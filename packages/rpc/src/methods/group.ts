import type { RpcClient } from '../client';
import type { Address, GroupRow, GroupMembershipRow, GroupQueryParams, Filter } from '@circles-sdk/types';
import { normalizeAddress, checksumAddresses } from '../utils';

interface QueryResponse {
  columns: string[];
  rows: any[][];
}

/**
 * Group query RPC methods
 */
export class GroupMethods {
  constructor(private client: RpcClient) {}

  private transformQueryResponse<T>(response: QueryResponse): T[] {
    const { columns, rows } = response;
    return rows.map((row) => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });
      return obj as T;
    });
  }

  /**
   * Find groups with optional filters
   *
   * @param limit - Maximum number of groups to return (default: 50)
   * @param params - Optional query parameters to filter groups
   * @returns Array of group rows
   *
   * @example
   * ```typescript
   * // Find all groups
   * const allGroups = await rpc.group.findGroups(50);
   *
   * // Find groups by name prefix (client-side filtering)
   * const groups = await rpc.group.findGroups(50, {
   *   nameStartsWith: 'Community'
   * });
   *
   * // Find groups by owner
   * const myGroups = await rpc.group.findGroups(50, {
   *   ownerEquals: '0xde374ece6fa50e781e81aac78e811b33d16912c7'
   * });
   * ```
   */
  async findGroups(
    limit: number = 50,
    params?: GroupQueryParams
  ): Promise<GroupRow[]> {
    const filter: Filter[] = [];

    // Client-side filters (not supported by RPC server)
    const clientFilters = {
      nameStartsWith: params?.nameStartsWith,
      symbolStartsWith: params?.symbolStartsWith,
    };

    // For client-side filters, fetch more results to account for filtering
    const fetchLimit = (clientFilters.nameStartsWith || clientFilters.symbolStartsWith)
      ? Math.max(limit * 5, 500) // Fetch 5x the limit or 500, whichever is larger
      : limit;

    if (params) {
      // Server-side filters only

      if (params.groupAddressIn && params.groupAddressIn.length > 0) {
        filter.push({
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'group',
          Value: params.groupAddressIn.map((addr) => normalizeAddress(addr)).join(','),
        });
      }

      if (params.groupTypeIn && params.groupTypeIn.length > 0) {
        filter.push({
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'type',
          Value: params.groupTypeIn.join(','),
        });
      }

      if (params.ownerEquals) {
        filter.push({
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'owner',
          Value: normalizeAddress(params.ownerEquals),
        });
      }

      if (params.mintHandlerEquals) {
        filter.push({
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'mintHandler',
          Value: normalizeAddress(params.mintHandlerEquals),
        });
      }

      if (params.treasuryEquals) {
        filter.push({
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'treasury',
          Value: normalizeAddress(params.treasuryEquals),
        });
      }
    }

    const finalFilter: Filter[] =
      filter.length > 1
        ? [
            {
              Type: 'Conjunction',
              ConjunctionType: 'And',
              Predicates: filter,
            },
          ]
        : filter;

    const response = await this.client.call<[any], QueryResponse>('circles_query', [
      {
        Namespace: 'V_CrcV2',
        Table: 'Groups',
        Columns: [
          'blockNumber',
          'timestamp',
          'transactionIndex',
          'logIndex',
          'transactionHash',
          'group',
          'type',
          'owner',
          'mintPolicy',
          'mintHandler',
          'treasury',
          'service',
          'feeCollection',
          'memberCount',
          'name',
          'symbol',
          'cidV0Digest',
          'erc20WrapperDemurraged',
          'erc20WrapperStatic',
        ],
        Filter: finalFilter,
        Order: [
          {
            Column: 'blockNumber',
            SortOrder: 'DESC',
          },
        ],
        Limit: fetchLimit,
      },
    ]);

    let results = this.transformQueryResponse<GroupRow>(response);

    // Apply client-side filters
    if (clientFilters.nameStartsWith) {
      results = results.filter(g =>
        g.name && g.name.toLowerCase().startsWith(clientFilters.nameStartsWith!.toLowerCase())
      );
    }

    if (clientFilters.symbolStartsWith) {
      results = results.filter(g =>
        g.symbol && g.symbol.toLowerCase().startsWith(clientFilters.symbolStartsWith!.toLowerCase())
      );
    }

    // Apply limit after client-side filtering
    const limited = results.slice(0, limit);
    return checksumAddresses(limited);
  }

  /**
   * Get group memberships for an avatar
   *
   * @param avatar - Avatar address to query group memberships for
   * @param limit - Maximum number of memberships to return (default: 50)
   * @returns Array of group membership rows
   *
   * @example
   * ```typescript
   * const memberships = await rpc.group.getGroupMemberships(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7',
   *   50
   * );
   * ```
   */
  async getGroupMemberships(
    avatar: Address,
    limit: number = 50
  ): Promise<GroupMembershipRow[]> {
    const normalized = normalizeAddress(avatar);

    const response = await this.client.call<[any], QueryResponse>('circles_query', [
      {
        Namespace: 'V_CrcV2',
        Table: 'GroupMemberships',
        Columns: [
          'blockNumber',
          'timestamp',
          'transactionIndex',
          'logIndex',
          'transactionHash',
          'group',
          'member',
          'expiryTime',
        ],
        Filter: [
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'member',
            Value: normalized,
          },
        ],
        Order: [
          {
            Column: 'blockNumber',
            SortOrder: 'DESC',
          },
        ],
        Limit: limit,
      },
    ]);

    const result = this.transformQueryResponse<GroupMembershipRow>(response);
    return checksumAddresses(result);
  }
}

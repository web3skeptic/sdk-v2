import type { RpcClient } from '../client';
import type { Address, GroupRow, GroupMembershipRow, GroupQueryParams, Filter, TokenBalance } from '@circles-sdk-v2/types';
import { normalizeAddress, checksumAddresses } from '../utils';
import { PagedQuery } from '../pagedQuery';

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
   * Get group memberships for an avatar using cursor-based pagination
   *
   * @param avatar - Avatar address to query group memberships for
   * @param limit - Number of memberships per page (default: 50)
   * @param sortOrder - Sort order for results (default: 'DESC')
   * @returns PagedQuery instance for iterating through memberships
   *
   * @example
   * ```typescript
   * const query = rpc.group.getGroupMemberships(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7',
   *   50
   * );
   * await query.queryNextPage();
   * console.log(query.currentPage.results);
   * ```
   */
  getGroupMemberships(
    avatar: Address,
    limit: number = 50,
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): PagedQuery<GroupMembershipRow> {
    const normalized = normalizeAddress(avatar);

    return new PagedQuery<GroupMembershipRow>(
      this.client,
      {
        namespace: 'V_CrcV2',
        table: 'GroupMemberships',
        sortOrder,
        columns: [
          'blockNumber',
          'timestamp',
          'transactionIndex',
          'logIndex',
          'transactionHash',
          'group',
          'member',
          'expiryTime',
        ],
        filter: [
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'member',
            Value: normalized,
          },
        ],
        limit,
      },
      (row) => checksumAddresses(row) as GroupMembershipRow
    );
  }

  /**
   * Get all holders of a group token
   *
   * Returns all avatars that hold the specified group token, including their balance amounts.
   *
   * @param groupAddress - The address of the group token
   * @param limit - Maximum number of holders to return (default: 100)
   * @returns Array of token balances showing who holds the group token
   *
   * @example
   * ```typescript
   * // Get all holders of a group token
   * const holders = await rpc.group.getGroupHolders('0xGroupAddress...', 100);
   * console.log(`${holders.length} holders of this group token`);
   *
   * holders.forEach(holder => {
   *   console.log(`Holder: ${holder.tokenOwner}`);
   *   console.log(`Balance: ${holder.circles} CRC`);
   * });
   * ```
   */
  async getGroupHolders(groupAddress: Address, limit: number = 100): Promise<TokenBalance[]> {
    const normalized = normalizeAddress(groupAddress);

    const response = await this.client.call<[any], QueryResponse>('circles_query', [
      {
        Namespace: 'V_CrcV2',
        Table: 'TokenBalances',
        Columns: [
          'tokenAddress',
          'tokenId',
          'tokenOwner',
          'tokenType',
          'version',
          'attoCircles',
          'circles',
          'staticAttoCircles',
          'staticCircles',
          'attoCrc',
          'crc',
          'isErc20',
          'isErc1155',
          'isWrapped',
          'isInflationary',
          'isGroup',
        ],
        Filter: [
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'tokenAddress',
            Value: normalized,
          },
        ],
        Order: [
          {
            Column: 'attoCircles',
            SortOrder: 'DESC',
          },
        ],
        Limit: limit,
      },
    ]);

    // Transform the query response
    const { columns, rows } = response;
    const results = rows.map((row: any[]) => {
      const obj: any = {};
      columns.forEach((col: string, index: number) => {
        // Convert string values to bigint for specific fields
        if (['tokenId', 'attoCircles', 'staticAttoCircles', 'attoCrc'].includes(col)) {
          obj[col] = BigInt(row[index]);
        } else {
          obj[col] = row[index];
        }
      });
      return obj as TokenBalance;
    });

    return checksumAddresses(results);
  }

  /**
   * Get members of a group using cursor-based pagination
   *
   * Returns a PagedQuery instance that can be used to fetch members page by page
   * using cursor-based pagination.
   *
   * @param groupAddress - The address of the group to query members for
   * @param limit - Number of members per page (default: 100)
   * @param sortOrder - Sort order for results (default: 'DESC')
   * @returns PagedQuery instance for iterating through group members
   *
   * @example
   * ```typescript
   * const query = rpc.group.getGroupMembers('0xGroupAddress...', 100);
   *
   * // Get first page
   * await query.queryNextPage();
   * console.log(query.currentPage.results);
   *
   * // Get next page if available
   * if (query.currentPage.hasMore) {
   *   await query.queryNextPage();
   *   console.log(query.currentPage.results);
   * }
   * ```
   */
  getGroupMembers(
    groupAddress: Address,
    limit: number = 100,
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): PagedQuery<GroupMembershipRow> {
    const normalized = normalizeAddress(groupAddress);

    return new PagedQuery<GroupMembershipRow>(
      this.client,
      {
        namespace: 'V_CrcV2',
        table: 'GroupMemberships',
        sortOrder,
        columns: [
          'blockNumber',
          'timestamp',
          'transactionIndex',
          'logIndex',
          'transactionHash',
          'group',
          'member',
          'expiryTime',
        ],
        filter: [
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'group',
            Value: normalized,
          },
        ],
        limit,
      },
      (row) => checksumAddresses(row) as GroupMembershipRow
    );
  }

  /**
   * Get groups using cursor-based pagination
   *
   * Returns a PagedQuery instance that can be used to fetch groups page by page
   * using cursor-based pagination.
   *
   * @param limit - Number of groups per page (default: 50)
   * @param params - Optional query parameters to filter groups
   * @param sortOrder - Sort order for results (default: 'DESC')
   * @returns PagedQuery instance for iterating through groups
   *
   * @example
   * ```typescript
   * // Query all groups
   * const query = rpc.group.getGroups(50);
   *
   * // Query groups by owner
   * const myGroupsQuery = rpc.group.getGroups(50, {
   *   ownerEquals: '0xMyAddress...'
   * });
   *
   * await myGroupsQuery.queryNextPage();
   * console.log(myGroupsQuery.currentPage.results);
   * ```
   */
  getGroups(
    limit: number = 50,
    params?: GroupQueryParams,
    sortOrder: 'ASC' | 'DESC' = 'DESC'
  ): PagedQuery<GroupRow> {
    const filter: Filter[] = [];

    if (params) {
      // Note: Client-side filters (nameStartsWith, symbolStartsWith) are not supported in PagedQuery
      // Only server-side filters are included

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

    return new PagedQuery<GroupRow>(
      this.client,
      {
        namespace: 'V_CrcV2',
        table: 'Groups',
        sortOrder,
        columns: [
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
        filter: finalFilter,
        limit,
      },
      (row) => checksumAddresses(row) as GroupRow
    );
  }
}

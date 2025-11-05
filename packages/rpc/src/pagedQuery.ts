import type { RpcClient } from './client';
import type {
  EventRow,
  Cursor,
  PagedResult,
  PagedQueryParams,
  Filter,
  OrderBy,
  QueryParams,
} from '@circles-sdk-v2/types';

interface QueryResponse {
  columns: string[];
  rows: any[][];
}

/**
 * A class for querying Circles RPC nodes with cursor-based pagination.
 * The class maintains the state of the current page and provides methods for querying the next pages.
 *
 * Usage:
 * 1. Create a new instance of PagedQuery with the RpcClient instance and the query parameters.
 * 2. Call queryNextPage() to get the next page of results.
 * 3. Access the results and cursors from the currentPage property.
 * 4. Repeat step 2 until there are no more results.
 *
 * @typeParam TRow The type of the rows returned by the query (must extend EventRow).
 *
 * @example
 * ```typescript
 * const query = new PagedQuery<TokenBalance>(rpc.client, {
 *   namespace: 'V_CrcV2',
 *   table: 'TokenBalances',
 *   sortOrder: 'DESC',
 *   columns: ['tokenAddress', 'tokenOwner', 'attoCircles', ...],
 *   filter: [{ Type: 'FilterPredicate', FilterType: 'Equals', Column: 'tokenAddress', Value: '0x...' }],
 *   limit: 100
 * });
 *
 * // Get first page
 * await query.queryNextPage();
 * console.log(query.currentPage.results);
 *
 * // Get next page
 * if (query.currentPage.hasMore) {
 *   await query.queryNextPage();
 *   console.log(query.currentPage.results);
 * }
 * ```
 */
// @todo to be reviewed
export class PagedQuery<TRow extends EventRow> {
  private readonly params: PagedQueryParams;
  private readonly client: RpcClient;
  private readonly rowTransformer?: (row: any) => TRow;

  /**
   * The current page of the query (or undefined if no query has been executed yet).
   */
  get currentPage(): PagedResult<TRow> | undefined {
    return this._currentPage;
  }

  private _currentPage?: PagedResult<TRow>;

  /**
   * Creates a new PagedQuery instance.
   *
   * @param client - The RpcClient instance to use for queries
   * @param params - The query parameters
   * @param rowTransformer - Optional function to transform raw rows into TRow objects
   */
  constructor(
    client: RpcClient,
    params: PagedQueryParams,
    rowTransformer?: (row: any) => TRow
  ) {
    this.params = params;
    this.client = client;
    this.rowTransformer = rowTransformer;
  }

  /**
   * Builds the order by clause for a paged query.
   * Always orders by blockNumber, transactionIndex, and logIndex.
   * If the table is TransferBatch, also orders by batchIndex.
   * @private
   */
  private buildOrderBy(params: PagedQueryParams): OrderBy[] {
    const order: OrderBy[] = [
      {
        Column: 'blockNumber',
        SortOrder: params.sortOrder,
      },
      {
        Column: 'transactionIndex',
        SortOrder: params.sortOrder,
      },
      {
        Column: 'logIndex',
        SortOrder: params.sortOrder,
      },
    ];

    if (params.table === 'TransferBatch') {
      order.push({
        Column: 'batchIndex',
        SortOrder: params.sortOrder,
      });
    }

    return order;
  }

  /**
   * Builds the cursor filter for a paged query.
   * Depending on the sort order, the cursor filter will be either greater than or less than the existing cursor.
   * @private
   */
  private buildCursorFilter(params: PagedQueryParams, cursor?: Cursor): Filter[] | undefined {
    if (!cursor) {
      return undefined;
    }

    const sortOrder = params.sortOrder === 'ASC' ? 'GreaterThan' : 'LessThan';

    // Add primary filter for blockNumber
    const blockNumberFilter: Filter = {
      Type: 'FilterPredicate',
      FilterType: sortOrder,
      Column: 'blockNumber',
      Value: cursor.blockNumber,
    };

    // Create compound filter for transactionIndex, logIndex, and batchIndex
    const subFilters: Filter[] = [];

    // Filter for transactionIndex if blockNumber is equal
    subFilters.push({
      Type: 'Conjunction',
      ConjunctionType: 'And',
      Predicates: [
        {
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'blockNumber',
          Value: cursor.blockNumber,
        },
        {
          Type: 'FilterPredicate',
          FilterType: sortOrder,
          Column: 'transactionIndex',
          Value: cursor.transactionIndex,
        },
      ],
    });

    // Filter for logIndex if blockNumber and transactionIndex are equal
    subFilters.push({
      Type: 'Conjunction',
      ConjunctionType: 'And',
      Predicates: [
        {
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'blockNumber',
          Value: cursor.blockNumber,
        },
        {
          Type: 'FilterPredicate',
          FilterType: 'Equals',
          Column: 'transactionIndex',
          Value: cursor.transactionIndex,
        },
        {
          Type: 'FilterPredicate',
          FilterType: sortOrder,
          Column: 'logIndex',
          Value: cursor.logIndex,
        },
      ],
    });

    // Filter for batchIndex if applicable and all previous columns are equal
    if (params.table === 'TransferBatch' && cursor.batchIndex !== undefined) {
      subFilters.push({
        Type: 'Conjunction',
        ConjunctionType: 'And',
        Predicates: [
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'blockNumber',
            Value: cursor.blockNumber,
          },
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'transactionIndex',
            Value: cursor.transactionIndex,
          },
          {
            Type: 'FilterPredicate',
            FilterType: 'Equals',
            Column: 'logIndex',
            Value: cursor.logIndex,
          },
          {
            Type: 'FilterPredicate',
            FilterType: sortOrder,
            Column: 'batchIndex',
            Value: cursor.batchIndex,
          },
        ],
      });
    }

    // Combine the primary and compound filters into a single filter
    const combinedFilter: Filter = {
      Type: 'Conjunction',
      ConjunctionType: 'Or',
      Predicates: [blockNumberFilter, ...subFilters],
    };

    return [combinedFilter];
  }

  /**
   * Combines two filters into a single filter.
   * The filters are always combined with an 'And' conjunction.
   * @private
   */
  private combineFilters(filter1?: Filter[], filter2?: Filter[]): Filter[] {
    if (!filter1 && !filter2) {
      return [];
    }

    if (!filter1) {
      return filter2 ?? [];
    }

    if (!filter2) {
      return filter1;
    }

    return [
      {
        Type: 'Conjunction',
        ConjunctionType: 'And',
        Predicates: [...filter1, ...filter2],
      },
    ];
  }

  /**
   * Converts the rows from a Circles RPC response to an array of objects.
   * @private
   */
  private rowsToObjects(response: QueryResponse): TRow[] {
    const { columns, rows } = response;

    return rows.map((row) => {
      const rowObj: any = {};
      columns.forEach((col, index) => {
        rowObj[col] = row[index];
      });

      // Apply row transformer if provided
      if (this.rowTransformer) {
        return this.rowTransformer(rowObj);
      }

      return rowObj as TRow;
    });
  }

  /**
   * Converts a row from a query result to a cursor.
   * The cursor is an object with the blockNumber, transactionIndex, logIndex, and optional batchIndex properties.
   * @private
   */
  private rowToCursor(resultElement: TRow): Cursor {
    return {
      blockNumber: resultElement.blockNumber,
      transactionIndex: resultElement.transactionIndex,
      logIndex: resultElement.logIndex,
      batchIndex: resultElement.batchIndex,
    };
  }

  /**
   * Builds a cursor from the first or last row of a query result.
   * If the result is empty, returns null.
   * @private
   */
  private getFirstAndLastCursor(result: TRow[]): {
    first: Cursor;
    last: Cursor;
  } | null {
    if (result.length === 0) {
      return null;
    }

    const first = this.rowToCursor(result[0]);
    const last = this.rowToCursor(result[result.length - 1]);

    return { first, last };
  }

  /**
   * Queries the next page of results.
   * Updates the currentPage property with the new page.
   *
   * @returns True if the query returned rows, false if there are no more results.
   *
   * @example
   * ```typescript
   * const hasResults = await query.queryNextPage();
   * if (hasResults) {
   *   console.log('Got', query.currentPage.size, 'results');
   * } else {
   *   console.log('No more results');
   * }
   * ```
   */
  public async queryNextPage(): Promise<boolean> {
    const orderBy = this.buildOrderBy(this.params);
    const filter = this.buildCursorFilter(this.params, this._currentPage?.lastCursor);
    const combinedFilter = this.combineFilters(this.params.filter, filter);

    const queryParams: QueryParams = {
      Namespace: this.params.namespace,
      Table: this.params.table,
      Columns: this.params.columns,
      Filter: combinedFilter,
      Order: orderBy,
      Limit: this.params.limit,
    };

    const response = await this.client.call<[QueryParams], QueryResponse>('circles_query', [
      queryParams,
    ]);
    const result = this.rowsToObjects(response);
    const cursors = this.getFirstAndLastCursor(result);

    this._currentPage = {
      limit: this.params.limit,
      size: result.length,
      firstCursor: cursors?.first,
      lastCursor: cursors?.last,
      sortOrder: this.params.sortOrder,
      hasMore: result.length === this.params.limit, // If we got a full page, there might be more
      results: result,
    };

    return result.length > 0;
  }

  /**
   * Resets the query to start from the beginning.
   * Clears the current page state.
   */
  public reset(): void {
    this._currentPage = undefined;
  }
}

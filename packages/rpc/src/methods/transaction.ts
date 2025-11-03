import type { RpcClient } from '../client';
import type { Address, TransactionHistoryRow } from '@circles-sdk/types';
import { normalizeAddress, checksumAddresses } from '../utils';
import { CirclesConverter } from '@circles-sdk/utils';

interface QueryResponse {
  columns: string[];
  rows: any[][];
}

/**
 * Calculate circle amounts for v2 transactions
 */
function calculateCircleAmounts(value: string, timestamp: number): {
  circles: number;
  attoCircles: bigint;
  staticCircles: number;
  staticAttoCircles: bigint;
  crc: number;
  attoCrc: bigint;
} {
  // v2: value is attoCircles (demurraged)
  const attoCircles = BigInt(value);
  const circles = CirclesConverter.attoCirclesToCircles(attoCircles);

  const attoCrc = CirclesConverter.attoCirclesToAttoCrc(attoCircles, BigInt(timestamp));
  const crc = CirclesConverter.attoCirclesToCircles(attoCrc);

  const staticAttoCircles = CirclesConverter.attoCirclesToAttoStaticCircles(attoCircles, BigInt(timestamp));
  const staticCircles = CirclesConverter.attoCirclesToCircles(staticAttoCircles);

  return {
    attoCircles,
    circles,
    staticAttoCircles,
    staticCircles,
    attoCrc,
    crc,
  };
}

/**
 * Transaction history RPC methods
 */
export class TransactionMethods {
  constructor(private client: RpcClient) {}

  /**
   * Get v2 transaction history for an address
   * Returns v2 transfers (incoming/outgoing/minting) with calculated circle amounts
   *
   * @param avatar - Avatar address to query transaction history for
   * @param limit - Maximum number of transactions to return (default: 50)
   * @returns Array of v2 transaction history rows with circle conversions
   *
   * @example
   * ```typescript
   * const history = await rpc.transaction.getTransactionHistory(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7',
   *   50
   * );
   * history.forEach(tx => {
   *   console.log(`${tx.from} -> ${tx.to}: ${tx.circles} CRC`);
   * });
   * ```
   */
  async getTransactionHistory(
    avatar: Address,
    limit: number = 50
  ): Promise<TransactionHistoryRow[]> {
    const normalized = normalizeAddress(avatar);

    const response = await this.client.call<[any], QueryResponse>('circles_query', [
      {
        Namespace: 'V_Crc',
        Table: 'TransferSummary',
        Columns: [],
        Filter: [
          {
            Type: 'Conjunction',
            ConjunctionType: 'And',
            Predicates: [
              {
                Type: 'FilterPredicate',
                FilterType: 'Equals',
                Column: 'version',
                Value: 2,
              },
              {
                Type: 'Conjunction',
                ConjunctionType: 'Or',
                Predicates: [
                  {
                    Type: 'FilterPredicate',
                    FilterType: 'Equals',
                    Column: 'from',
                    Value: normalized,
                  },
                  {
                    Type: 'FilterPredicate',
                    FilterType: 'Equals',
                    Column: 'to',
                    Value: normalized,
                  },
                ],
              },
            ],
          },
        ],
        Order: [
          {
            Column: 'blockNumber',
            SortOrder: 'DESC',
          },
        ],
      },
    ]);

    // Transform rows into objects
    const { columns, rows } = response;
    const limitedRows = rows.slice(0, limit);

    const result = limitedRows.map((row) => {
      const obj: any = {};
      columns.forEach((col, index) => {
        obj[col] = row[index];
      });

      // Calculate circle amounts
      const amounts = calculateCircleAmounts(obj.value, obj.timestamp);

      return {
        ...obj,
        ...amounts,
      } as TransactionHistoryRow;
    });

    return checksumAddresses(result);
  }
}

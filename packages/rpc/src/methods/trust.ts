import type { RpcClient } from '../client';
import type { Address, TrustRelation } from '@circles-sdk-v2/types';
import { normalizeAddress, checksumAddresses } from '../utils';

interface QueryResponse {
  columns: string[];
  rows: any[][];
}

export type TrustRelationType = 'trusts' | 'trustedBy' | 'mutuallyTrusts';

export interface AggregatedTrustRelation {
  subjectAvatar: Address;
  relation: TrustRelationType;
  objectAvatar: Address;
  timestamp: number;
}

/**
 * Trust relation RPC methods
 */
export class TrustMethods {
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
   * Query the common trust relations of two addresses
   * (only common outgoing trust relations are considered)
   *
   * @param address1 - First address
   * @param address2 - Second address
   * @returns Array of common trusted addresses
   *
   * @example
   * ```typescript
   * const commonTrust = await rpc.trust.getCommonTrust(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7',
   *   '0xe8fc7a2d0573e5164597b05f14fa9a7fca7b215c'
   * );
   * ```
   */
  // @todo check if we need to normilize addr before the call
  async getCommonTrust(address1: Address, address2: Address): Promise<Address[]> {
    const result = await this.client.call<[Address, Address], Address[]>('circles_getCommonTrust', [
      normalizeAddress(address1),
      normalizeAddress(address2),
    ]);
    return checksumAddresses(result);
  }

  /**
   * Get all v2 trust relations for an address
   * Returns raw trust relations from the database
   *
   * @param avatar - Avatar address to query trust relations for
   * @returns Array of trust relations (both incoming and outgoing)
   *
   * @example
   * ```typescript
   * const relations = await rpc.trust.getTrustRelations(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7'
   * );
   * ```
   */
  async getTrustRelations(avatar: Address): Promise<TrustRelation[]> {
    const normalized = normalizeAddress(avatar);

    const response = await this.client.call<[any], QueryResponse>('circles_query', [
      {
        Namespace: 'V_Crc',
        Table: 'TrustRelations',
        Columns: [
          'blockNumber',
          'timestamp',
          'transactionIndex',
          'logIndex',
          'transactionHash',
          'version',
          'trustee',
          'truster',
          'expiryTime',
        ],
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
                    Column: 'trustee',
                    Value: normalized,
                  },
                  {
                    Type: 'FilterPredicate',
                    FilterType: 'Equals',
                    Column: 'truster',
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

    const result = this.transformQueryResponse<TrustRelation>(response);
    return checksumAddresses(result);
  }

  /**
   * Get aggregated trust relations for an address
   * Groups trust relations by counterpart and determines relationship type
   *
   * @param avatar - Avatar address to query trust relations for
   * @returns Aggregated trust relations with relationship types
   *
   * @example
   * ```typescript
   * const aggregated = await rpc.trust.getAggregatedTrustRelations(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7'
   * );
   * // Returns: [
   * //   { subjectAvatar: '0x...', relation: 'mutuallyTrusts', objectAvatar: '0x...', timestamp: 123 },
   * //   { subjectAvatar: '0x...', relation: 'trusts', objectAvatar: '0x...', timestamp: 456 }
   * // ]
   * ```
   */
  async getAggregatedTrustRelations(avatar: Address): Promise<AggregatedTrustRelation[]> {
    const normalized = normalizeAddress(avatar);
    const trustListRows = await this.getTrustRelations(normalized);

    // Group trust list rows by counterpart avatar
    const trustBucket: Record<Address, TrustRelation[]> = {};

    trustListRows.forEach((row) => {
      // Normalize addresses for comparison (both are already checksummed from getTrustRelations)
      const trusterNorm = normalizeAddress(row.truster);
      const trusteeNorm = normalizeAddress(row.trustee);
      const counterpart = trusterNorm !== normalized ? row.truster : row.trustee;

      if (!trustBucket[counterpart]) {
        trustBucket[counterpart] = [];
      }
      trustBucket[counterpart].push(row);
    });

    // Determine trust relations
    const result = Object.entries(trustBucket)
      .filter(([address]) => normalizeAddress(address as Address) !== normalized)
      .map(([address, rows]) => {
        const maxTimestamp = Math.max(...rows.map((o) => o.timestamp));

        let relation: TrustRelationType;
        if (rows.length === 2) {
          relation = 'mutuallyTrusts';
        } else if (normalizeAddress(rows[0]?.trustee) === normalized) {
          relation = 'trustedBy';
        } else if (normalizeAddress(rows[0]?.truster) === normalized) {
          relation = 'trusts';
        } else {
          throw new Error(`Unexpected trust list row. Couldn't determine trust relation.`);
        }

        return {
          subjectAvatar: normalized,
          relation,
          objectAvatar: address as Address,
          timestamp: maxTimestamp,
        };
      });

    return checksumAddresses(result);
  }

  /**
   * Get addresses that trust the given avatar (incoming trust)
   *
   * @param avatar - Avatar address to query
   * @returns Array of trust relations where others trust this avatar
   *
   * @example
   * ```typescript
   * const trustedBy = await rpc.trust.getTrustedBy(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7'
   * );
   * ```
   */
  async getTrustedBy(avatar: Address): Promise<AggregatedTrustRelation[]> {
    const normalized = normalizeAddress(avatar);
    const relations = await this.getAggregatedTrustRelations(normalized);
    const filtered = relations.filter((r) => r.relation === 'trustedBy');
    return checksumAddresses(filtered);
  }

  /**
   * Get addresses that the given avatar trusts (outgoing trust)
   *
   * @param avatar - Avatar address to query
   * @returns Array of trust relations where this avatar trusts others
   *
   * @example
   * ```typescript
   * const trusts = await rpc.trust.getTrusts(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7'
   * );
   * ```
   */
  async getTrusts(avatar: Address): Promise<AggregatedTrustRelation[]> {
    const normalized = normalizeAddress(avatar);
    const relations = await this.getAggregatedTrustRelations(normalized);
    const filtered = relations.filter((r) => r.relation === 'trusts');
    return checksumAddresses(filtered);
  }

  /**
   * Get mutual trust relations for the given avatar
   *
   * @param avatar - Avatar address to query
   * @returns Array of trust relations where both parties trust each other
   *
   * @example
   * ```typescript
   * const mutualTrusts = await rpc.trust.getMutualTrusts(
   *   '0xde374ece6fa50e781e81aac78e811b33d16912c7'
   * );
   * ```
   */
  async getMutualTrusts(avatar: Address): Promise<AggregatedTrustRelation[]> {
    const normalized = normalizeAddress(avatar);
    const relations = await this.getAggregatedTrustRelations(normalized);
    const filtered = relations.filter((r) => r.relation === 'mutuallyTrusts');
    return checksumAddresses(filtered);
  }
}

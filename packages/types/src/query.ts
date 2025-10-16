/**
 * Query and filter types for circles_query RPC method
 */

/**
 * Filter types for query predicates
 */
export type FilterType =
  | 'Equals'
  | 'NotEquals'
  | 'GreaterThan'
  | 'LessThan'
  | 'GreaterOrEqualThan'
  | 'LessOrEqualThan';

/**
 * Conjunction types for combining predicates
 */
export type ConjunctionType = 'And' | 'Or';

/**
 * Filter predicate for querying
 */
export interface FilterPredicate {
  Type: 'FilterPredicate';
  FilterType: FilterType;
  Column: string;
  Value: string | number | boolean;
}

/**
 * Conjunction for combining multiple predicates
 */
export interface Conjunction {
  Type: 'Conjunction';
  ConjunctionType: ConjunctionType;
  Predicates: (FilterPredicate | Conjunction)[];
}

/**
 * Filter type (either a predicate or conjunction)
 */
export type Filter = FilterPredicate | Conjunction;

/**
 * Order direction for query results
 */
export type SortOrder = 'ASC' | 'DESC';

/**
 * Order by clause
 */
export interface OrderBy {
  Column: string;
  SortOrder: SortOrder;
}

/**
 * Query parameters for circles_query
 */
export interface QueryParams {
  Namespace: string;
  Table: string;
  Columns: string[];
  Filter: Filter[];
  Order: OrderBy[];
  Limit?: number;
}

/**
 * Table information from circles_tables
 */
export interface TableInfo {
  Namespace: string;
  Table: string;
  Columns: {
    Name: string;
    Type: string;
  }[];
}

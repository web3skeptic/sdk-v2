import type { Address, FindPathParams, SimulatedBalance } from '@circles-sdk/types';
import { CirclesConverter } from '@circles-sdk/utils';

/**
 * Normalize an address to lowercase (required by the indexer)
 */
export function normalizeAddress(address: Address): Address {
  return address.toLowerCase() as Address;
}

/**
 * Normalize an array of addresses to lowercase
 */
export function normalizeAddresses(addresses: Address[]): Address[] {
  return addresses.map(addr => normalizeAddress(addr));
}

/**
 * Normalize and convert FindPathParams for RPC call
 * Converts camelCase to PascalCase and bigint to human-readable numbers
 */
export function normalizeFindPathParams(params: FindPathParams): Record<string, unknown> {
  return {
    Source: normalizeAddress(params.from),
    Sink: normalizeAddress(params.to),
    TargetFlow: params.targetFlow.toString(),
    WithWrap: params.useWrappedBalances,
    FromTokens: params.fromTokens?.map(normalizeAddress),
    ToTokens: params.toTokens?.map(normalizeAddress),
    ExcludedFromTokens: params.excludeFromTokens?.map(normalizeAddress),
    ExcludedToTokens: params.excludeToTokens?.map(normalizeAddress),
    SimulatedBalances: params.simulatedBalances?.map((balance: SimulatedBalance) => ({
      Holder: normalizeAddress(balance.holder),
      Token: normalizeAddress(balance.token),
      Amount: balance.amount.toString(),
      IsWrapped: balance.isWrapped,
    })),
  };
}

/**
 * Convert string numeric values to bigint in an object
 */
export function parseStringsToBigInt<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};

  for (const key in obj) {
    const value = obj[key];

    if (value === null || value === undefined) {
      result[key] = value;
    } else if (typeof value === 'string' && /^\d+$/.test(value)) {
      // Convert numeric strings to bigint
      result[key] = BigInt(value);
    } else if (typeof value === 'object' && !Array.isArray(value)) {
      // Recursively process nested objects
      result[key] = parseStringsToBigInt(value as Record<string, unknown>);
    } else if (Array.isArray(value)) {
      // Process arrays
      result[key] = value.map(item =>
        typeof item === 'object' && item !== null
          ? parseStringsToBigInt(item as Record<string, unknown>)
          : item
      );
    } else {
      result[key] = value;
    }
  }

  return result as T;
}

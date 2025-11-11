/**
 * Wrapper and Circles types
 */

/**
 * CirclesType enum
 * Represents the type of Circles ERC20 wrapper
 */
export enum CirclesType {
  Demurrage = 0,
  Inflation = 1
}

/**
 * Information about a wrapped token found in a transfer path
 * Maps wrapper address to [amount used in path, wrapper type]
 */
export type WrappedTokenInfo = {
  /** Amount of the wrapped token used in the path */
  amount: bigint;
  /** The type of wrapper (e.g., 'CrcV2_ERC20WrapperDeployed_Demurraged' or 'CrcV2_ERC20WrapperDeployed_Inflationary') */
  tokenType: string;
};

/**
 * Record of wrapped tokens found in a transfer path
 * Maps wrapper address to wrapped token information
 */
export type WrappedTokensRecord = Record<string, WrappedTokenInfo>;

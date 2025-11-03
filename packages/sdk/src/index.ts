// Main SDK class
export { Sdk } from './Sdk';

// Avatar classes
export { HumanAvatar, OrganisationAvatar, BaseGroupAvatar } from './avatars';
export type { PathfindingOptions } from './avatars';
export type { TransactionReceipt } from 'viem';

// Error handling
export { SdkError } from './errors';
export type { SdkErrorSource } from './errors';

// Re-export types from other packages for convenience
export type { AggregatedTrustRelation, TrustRelationType, CirclesEvent, CirclesEventType, Observable } from '@circles-sdk/rpc';
export type { TransactionHistoryRow, AvatarRow, TokenBalanceRow, TrustRelationRow, CirclesQuery, GroupType } from '@circles-sdk/types';
export type { ContractRunner } from '@circles-sdk/runner';

// SDK-specific types
export type { CirclesData } from './types';

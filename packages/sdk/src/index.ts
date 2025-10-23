// Main SDK class
export { Sdk } from './Sdk';

// Avatar classes
export { HumanAvatar } from './HumanAvatar';
export { BaseGroupAvatar } from './BaseGroupAvatar';
export type { TransactionReceipt } from 'viem';

// Error handling
export { SdkError } from './errors';
export type { SdkErrorSource } from './errors';

// All types (consolidated in types.ts)
export type {
  // Avatar types
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  CirclesEvent,
  CirclesQuery,
  Observable,
  // SDK types
  ContractRunner,
  CirclesData,
  HubV2,
  V2Pathfinder,
  GroupType,
} from './types';

// Main SDK class
export { Sdk } from './Sdk';

// Avatar classes
export { HumanAvatar } from './HumanAvatar';
export type { TransactionReceipt, ContractTransactionReceipt } from './HumanAvatar';

// Backwards compatibility - export HumanAvatar as Avatar
export { HumanAvatar as Avatar } from './HumanAvatar';

// All types (consolidated in types.ts)
export type {
  // Avatar types
  AvatarInterface,
  AvatarRow,
  TokenBalanceRow,
  TransactionHistoryRow,
  TrustRelationRow,
  CirclesEvent,
  CirclesQuery,
  Observable,
  // SDK types
  SdkInterface,
  ContractRunner,
  CirclesData,
  HubV2,
  V2Pathfinder,
  GroupType,
} from './types';

// Re-export common types from other packages for convenience
export type { Address, Profile, GroupProfile, CirclesConfig } from '@circles-sdk/types';
export type { TransactionResponse } from '@circles-sdk/types';

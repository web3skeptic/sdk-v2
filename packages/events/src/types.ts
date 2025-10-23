import type { Address } from '@circles-sdk/types';

/**
 * Base event structure with common fields
 */
export type CirclesBaseEvent = {
  blockNumber: number;
  timestamp?: number;
  transactionIndex: number;
  logIndex: number;
  transactionHash?: string;
};

/**
 * Union of all possible event type names from Circles contracts
 * Event names are prefixed with the contract version (CrcV2)
 */
export type CirclesEventType =
  // HubV2 events
  | 'CrcV2_ApprovalForAll'
  | 'CrcV2_DiscountCost'
  | 'CrcV2_FlowEdgesScopeLastEnded'
  | 'CrcV2_FlowEdgesScopeSingleStarted'
  | 'CrcV2_GroupMint'
  | 'CrcV2_PersonalMint'
  | 'CrcV2_RegisterGroup'
  | 'CrcV2_RegisterHuman'
  | 'CrcV2_RegisterOrganization'
  | 'CrcV2_SetAdvancedUsageFlag'
  | 'CrcV2_Stopped'
  | 'CrcV2_StreamCompleted'
  | 'CrcV2_TransferBatch'
  | 'CrcV2_TransferSingle'
  | 'CrcV2_Trust'
  | 'CrcV2_URI'
  // ERC20 Wrapper events
  | 'CrcV2_Approval'
  | 'CrcV2_DepositDemurraged'
  | 'CrcV2_DepositInflationary'
  | 'CrcV2_EIP712DomainChanged'
  | 'CrcV2_Transfer'
  | 'CrcV2_WithdrawDemurraged'
  | 'CrcV2_WithdrawInflationary'
  // Name Registry events
  | 'CrcV2_CidV0'
  | 'CrcV2_RegisterShortName'
  | 'CrcV2_UpdateMetadataDigest'
  // Base Group events
  | 'CrcV2_GroupRedeemCollateralBurn'
  | 'CrcV2_GroupRedeemCollateralReturn'
  // Invitation events (if any)
  | 'CrcV2_InviteHuman'
  // Unknown event fallback
  | 'Crc_UnknownEvent';

/**
 * Circles event structure
 * Uses discriminated union on $event field
 * Event data is flexible - contains arbitrary fields from the contract event
 */
export type CirclesEvent = CirclesBaseEvent & {
  $event: CirclesEventType;
  [key: string]: any; // Flexible fields from the event
};

/**
 * Type guard to check if an object is a CirclesEvent
 */
export function isCirclesEvent(obj: any): obj is CirclesEvent {
  return (
    obj &&
    typeof obj === 'object' &&
    typeof obj.$event === 'string' &&
    typeof obj.blockNumber === 'number' &&
    typeof obj.transactionIndex === 'number' &&
    typeof obj.logIndex === 'number'
  );
}

/**
 * Helper type to filter events by type
 */
export type CirclesEventOfType<T extends CirclesEventType> = CirclesEvent & {
  $event: T;
};

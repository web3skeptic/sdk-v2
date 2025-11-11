/**
 * Events types
 */

export type CirclesBaseEvent = {
  blockNumber: number;
  timestamp?: number;
  transactionIndex: number;
  logIndex: number;
  transactionHash?: string;
};

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

export type CirclesEvent = CirclesBaseEvent & {
  $event: CirclesEventType;
  [key: string]: any;
};

export type CirclesEventOfType<T extends CirclesEventType> = CirclesEvent & {
  $event: T;
};

export type RpcSubscriptionEvent = {
  event: string;
  values: Record<string, any>;
};

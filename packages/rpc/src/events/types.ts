import type { CirclesEvent } from '@circles-sdk-v2/types';

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

// Re-export types from @circles-sdk-v2/types for convenience
export type { CirclesBaseEvent, CirclesEventType, CirclesEvent, CirclesEventOfType, RpcSubscriptionEvent } from '@circles-sdk-v2/types';

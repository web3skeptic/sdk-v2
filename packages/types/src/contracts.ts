/**
 * Contract types
 * Types for contract-specific data structures and responses
 */

/**
 * Escrowed Amount and Days Result
 * Returned by InvitationEscrow.getEscrowedAmountAndDays()
 */
export interface EscrowedAmountAndDays {
  escrowedAmount: bigint;
  days_: bigint;
}

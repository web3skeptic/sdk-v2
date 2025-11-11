/**
 * Runner Package Error Types
 */

import { CirclesError } from '@aboutcircles/sdk-utils';

/**
 * Runner-specific error sources
 */
export type RunnerErrorSource =
  | 'RUNNER'
  | 'RUNNER_INITIALIZATION'
  | 'TRANSACTION_EXECUTION'
  | 'WALLET'
  | 'SAFE';

/**
 * Runner and transaction execution errors
 */
export class RunnerError extends CirclesError<RunnerErrorSource> {
  constructor(
    message: string,
    options?: {
      code?: string | number;
      source?: RunnerErrorSource;
      cause?: unknown;
      context?: Record<string, any>;
    }
  ) {
    super('RunnerError', message, { ...options, source: options?.source ?? 'RUNNER' });
  }

  /**
   * Create error for initialization failures
   */
  static initializationFailed(runnerType: string, cause?: unknown): RunnerError {
    return new RunnerError(`Failed to initialize ${runnerType}`, {
      code: 'RUNNER_INIT_FAILED',
      source: 'RUNNER_INITIALIZATION',
      cause,
      context: { runnerType },
    });
  }

  /**
   * Create error for transaction execution failures
   */
  static executionFailed(reason: string, cause?: unknown): RunnerError {
    return new RunnerError(`Transaction execution failed: ${reason}`, {
      code: 'RUNNER_EXECUTION_FAILED',
      source: 'TRANSACTION_EXECUTION',
      cause,
      context: { reason },
    });
  }

  /**
   * Create error for wallet-related issues
   */
  static walletError(message: string, cause?: unknown): RunnerError {
    return new RunnerError(message, {
      code: 'RUNNER_WALLET_ERROR',
      source: 'WALLET',
      cause,
    });
  }

  /**
   * Create error for Safe-specific issues
   */
  static safeError(message: string, safeAddress: string, cause?: unknown): RunnerError {
    return new RunnerError(message, {
      code: 'RUNNER_SAFE_ERROR',
      source: 'SAFE',
      cause,
      context: { safeAddress },
    });
  }

  /**
   * Create error for missing signer
   */
  static missingSigner(): RunnerError {
    return new RunnerError('Signer is required for this operation', {
      code: 'RUNNER_MISSING_SIGNER',
      source: 'WALLET',
    });
  }

  /**
   * Create error for transaction timeout
   */
  static timeout(txHash: string, timeout: number): RunnerError {
    return new RunnerError('Transaction timed out', {
      code: 'RUNNER_TX_TIMEOUT',
      source: 'TRANSACTION_EXECUTION',
      context: { txHash, timeout },
    });
  }

  /**
   * Create error for reverted transactions
   */
  static transactionReverted(
    txHash: string,
    blockNumber: bigint,
    gasUsed: bigint,
    cause?: unknown
  ): RunnerError {
    return new RunnerError('Transaction reverted', {
      code: 'RUNNER_TX_REVERTED',
      source: 'TRANSACTION_EXECUTION',
      cause,
      context: {
        transactionHash: txHash,
        blockNumber: blockNumber.toString(),
        gasUsed: gasUsed.toString(),
      },
    });
  }
}

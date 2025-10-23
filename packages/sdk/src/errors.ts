/**
 * SDK Package Error Types
 */

import { CirclesError } from '@circles-sdk/utils';

/**
 * SDK-specific error sources
 */
export type SdkErrorSource =
  | 'SDK'
  | 'SDK_INITIALIZATION'
  | 'SDK_CONFIG'
  | 'SDK_OPERATION';

/**
 * SDK-related errors
 */
export class SdkError extends CirclesError<SdkErrorSource> {
  constructor(
    message: string,
    options?: {
      code?: string | number;
      source?: SdkErrorSource;
      cause?: unknown;
      context?: Record<string, any>;
    }
  ) {
    super('SdkError', message, { ...options, source: options?.source ?? 'SDK' });
  }

  /**
   * Create error for uninitialized components
   */
  static notInitialized(component: string): SdkError {
    return new SdkError(`${component} is not initialized`, {
      code: 'SDK_NOT_INITIALIZED',
      source: 'SDK_INITIALIZATION',
      context: { component },
    });
  }

  /**
   * Create error for unsupported operations
   */
  static unsupportedOperation(operation: string, reason?: string): SdkError {
    return new SdkError(
      reason ? `Operation '${operation}' is not supported: ${reason}` : `Operation '${operation}' is not supported`,
      {
        code: 'SDK_UNSUPPORTED_OPERATION',
        source: 'SDK_OPERATION',
        context: { operation, reason },
      }
    );
  }

  /**
   * Create error for configuration issues
   */
  static configError(message: string, context?: Record<string, any>): SdkError {
    return new SdkError(message, {
      code: 'SDK_CONFIG_ERROR',
      source: 'SDK_CONFIG',
      context,
    });
  }

  /**
   * Create error for failed operations
   */
  static operationFailed(operation: string, reason: string, cause?: unknown): SdkError {
    return new SdkError(`Operation '${operation}' failed: ${reason}`, {
      code: 'SDK_OPERATION_FAILED',
      source: 'SDK_OPERATION',
      cause,
      context: { operation, reason },
    });
  }
}

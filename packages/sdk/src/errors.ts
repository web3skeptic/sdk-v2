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

  /**
   * Create error for missing contract runner
   */
  static missingContractRunner(operation?: string): SdkError {
    return new SdkError(
      operation
        ? `${operation} requires a contract runner. Initialize SDK with a ContractRunner.`
        : 'Operation requires a contract runner. Initialize SDK with a ContractRunner.',
      {
        code: 'SDK_MISSING_CONTRACT_RUNNER',
        source: 'SDK_INITIALIZATION',
        context: { operation },
      }
    );
  }

  /**
   * Create error for avatar not found
   */
  static avatarNotFound(address: string): SdkError {
    return new SdkError(`Avatar not found at address: ${address}`, {
      code: 'SDK_AVATAR_NOT_FOUND',
      source: 'SDK_OPERATION',
      context: { address },
    });
  }

  /**
   * Create error for invalid profile
   */
  static invalidProfile(reason: string, context?: Record<string, any>): SdkError {
    return new SdkError(`Invalid profile: ${reason}`, {
      code: 'SDK_INVALID_PROFILE',
      source: 'SDK_OPERATION',
      context,
    });
  }

  /**
   * Create error for profile operation failures
   */
  static profileOperationFailed(operation: string, reason: string, cause?: unknown): SdkError {
    return new SdkError(`Profile ${operation} failed: ${reason}`, {
      code: 'SDK_PROFILE_OPERATION_FAILED',
      source: 'SDK_OPERATION',
      cause,
      context: { operation, reason },
    });
  }

  /**
   * Create error for insufficient balance
   */
  static insufficientBalance(required: string, available: string, token?: string): SdkError {
    return new SdkError(
      token
        ? `Insufficient ${token} balance. Required: ${required}, Available: ${available}`
        : `Insufficient balance. Required: ${required}, Available: ${available}`,
      {
        code: 'SDK_INSUFFICIENT_BALANCE',
        source: 'SDK_OPERATION',
        context: { required, available, token },
      }
    );
  }

  /**
   * Create error for transaction extraction failures
   */
  static transactionDataExtractionFailed(dataType: string, reason?: string): SdkError {
    return new SdkError(
      reason
        ? `Failed to extract ${dataType} from transaction: ${reason}`
        : `Failed to extract ${dataType} from transaction`,
      {
        code: 'SDK_TX_DATA_EXTRACTION_FAILED',
        source: 'SDK_OPERATION',
        context: { dataType, reason },
      }
    );
  }

  /**
   * Create error for registration failures
   */
  static registrationFailed(avatarType: string, reason: string, cause?: unknown): SdkError {
    return new SdkError(`Failed to register ${avatarType}: ${reason}`, {
      code: 'SDK_REGISTRATION_FAILED',
      source: 'SDK_OPERATION',
      cause,
      context: { avatarType, reason },
    });
  }
}

/**
 * Circles SDK Error Handling
 * Provides a structured error system for consistent error handling across the SDK
 */

/**
 * Base error source type
 * Each package exports its own specific ErrorSource
 */
export type BaseErrorSource =
  | 'UTILS'
  | 'RPC'
  | 'SDK'
  | 'CORE'
  | 'RUNNER'
  | 'PROFILES'
  | 'TRANSFERS'
  | 'EVENTS'
  | 'PATHFINDER'
  | 'UNKNOWN';

/**
 * Utils package error source
 */
export type UtilsErrorSource = 'UTILS' | 'VALIDATION' | 'CONVERSION' | 'ENCODING';

/**
 * Base Circles SDK Error
 * All SDK errors extend from this class
 */
export class CirclesError<TSource extends string = string> extends Error {
  public readonly name: string;
  public readonly code?: string | number;
  public readonly source: TSource;
  public readonly cause?: unknown;
  public readonly context?: Record<string, any>;

  constructor(
    name: string,
    message: string,
    options?: {
      code?: string | number;
      source?: TSource;
      cause?: unknown;
      context?: Record<string, any>;
    }
  ) {
    super(message);
    this.name = name;
    this.code = options?.code;
    this.source = (options?.source ?? 'UNKNOWN') as TSource;
    this.cause = options?.cause;
    this.context = options?.context;

    // Maintain proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  /**
   * Convert error to JSON for logging/debugging
   */
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      source: this.source,
      context: this.context,
      cause: this.cause instanceof Error ? {
        name: this.cause.name,
        message: this.cause.message,
      } : this.cause,
      stack: this.stack,
    };
  }

  /**
   * Get formatted error message with context
   */
  toString(): string {
    let result = `[${this.source}] ${this.name}: ${this.message}`;
    if (this.code) {
      result += ` (Code: ${this.code})`;
    }
    if (this.context) {
      result += `\nContext: ${JSON.stringify(this.context, null, 2)}`;
    }
    return result;
  }
}

/**
 * Validation errors
 */
export class ValidationError extends CirclesError<UtilsErrorSource> {
  constructor(
    message: string,
    options?: {
      code?: string | number;
      cause?: unknown;
      context?: Record<string, any>;
    }
  ) {
    super('ValidationError', message, { ...options, source: 'VALIDATION' });
  }


  /**
   * Create error for invalid address
   */
  static invalidAddress(address: string): ValidationError {
    return new ValidationError('Invalid Ethereum address', {
      code: 'VALIDATION_INVALID_ADDRESS',
      context: { address },
    });
  }

  /**
   * Create error for invalid amount
   */
  static invalidAmount(amount: any, reason?: string): ValidationError {
    return new ValidationError(
      reason || 'Invalid amount',
      {
        code: 'VALIDATION_INVALID_AMOUNT',
        context: { amount, reason },
      }
    );
  }

  /**
   * Create error for missing parameter
   */
  static missingParameter(paramName: string): ValidationError {
    return new ValidationError(`Missing required parameter: ${paramName}`, {
      code: 'VALIDATION_MISSING_PARAM',
      context: { paramName },
    });
  }

  /**
   * Create error for invalid parameter
   */
  static invalidParameter(paramName: string, value: any, reason?: string): ValidationError {
    return new ValidationError(
      `Invalid parameter '${paramName}': ${reason || 'value is invalid'}`,
      {
        code: 'VALIDATION_INVALID_PARAM',
        context: { paramName, value, reason },
      }
    );
  }
}

/**
 * Encoding/Conversion errors for utils package
 */
export class EncodingError extends CirclesError<UtilsErrorSource> {
  constructor(
    message: string,
    options?: {
      code?: string | number;
      cause?: unknown;
      context?: Record<string, any>;
    }
  ) {
    super('EncodingError', message, { ...options, source: 'ENCODING' });
  }

  /**
   * Create error for ABI encoding failures
   */
  static abiEncoding(functionName: string, cause?: unknown): EncodingError {
    return new EncodingError('Failed to encode ABI data', {
      code: 'ENCODING_ABI_FAILED',
      cause,
      context: { functionName },
    });
  }

  /**
   * Create error for CID conversion failures
   */
  static cidConversion(cid: string, cause?: unknown): EncodingError {
    return new EncodingError('Failed to convert CID', {
      code: 'ENCODING_CID_FAILED',
      cause,
      context: { cid },
    });
  }
}

/**
 * Helper to wrap unknown errors into CirclesError
 */
export function wrapError(error: unknown, source: string = 'UNKNOWN'): CirclesError {
  if (error instanceof CirclesError) {
    return error;
  }

  if (error instanceof Error) {
    return new CirclesError(
      error.name || 'UnknownError',
      error.message,
      {
        source,
        cause: error,
      }
    );
  }

  return new CirclesError(
    'UnknownError',
    String(error),
    {
      source,
      cause: error,
    }
  );
}

/**
 * Type guard to check if error is a CirclesError
 */
export function isCirclesError(error: unknown): error is CirclesError {
  return error instanceof CirclesError;
}

/**
 * Helper to extract error message safely
 */
export function getErrorMessage(error: unknown): string {
  if (isCirclesError(error)) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

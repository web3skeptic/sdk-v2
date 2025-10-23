export { CirclesConverter } from './circlesConverter';
export { bytesToHex } from './bytes';
export { encodeFunctionData, decodeFunctionResult } from './abi';
export { cidV0ToHex, cidV0ToUint8Array } from './cid';

// Error handling
export {
  CirclesError,
  ValidationError,
  EncodingError,
  wrapError,
  isCirclesError,
  getErrorMessage,
} from './errors';
export type { BaseErrorSource, UtilsErrorSource } from './errors';
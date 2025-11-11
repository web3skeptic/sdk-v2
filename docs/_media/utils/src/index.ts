export { CirclesConverter } from './circlesConverter';
export { bytesToHex } from './bytes';
export { encodeFunctionData, decodeFunctionResult, decodeErrorResult, checksumAddress } from './abi';
export { cidV0ToHex, cidV0ToUint8Array } from './cid';
export { uint256ToAddress } from './address';
export { ZERO_ADDRESS } from './constants';
export { parseContractError, ContractError } from './contractErrors';

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
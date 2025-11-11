/**
 * Decoded contract error information
 * Contains parsed error data from failed contract transactions
 */
export interface DecodedContractError {
  errorName: string;
  args?: any[];
  selector: string;
  rawData: string;
  formattedMessage: string;
}

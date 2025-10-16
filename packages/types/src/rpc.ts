/**
 * JSON-RPC types
 */

/**
 * JSON-RPC request structure
 */
export interface JsonRpcRequest<TParams = unknown[]> {
  jsonrpc: '2.0';
  id: number | string;
  method: string;
  params: TParams;
}

/**
 * JSON-RPC response structure
 */
export interface JsonRpcResponse<TResult = unknown> {
  jsonrpc: '2.0';
  id: number | string;
  result?: TResult;
  error?: {
    code: number;
    message: string;
    data?: unknown;
  };
}

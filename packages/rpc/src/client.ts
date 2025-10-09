import type { JsonRpcRequest, JsonRpcResponse } from './types';

/**
 * Base RPC client for making JSON-RPC calls to Circles RPC endpoints
 */
export class RpcClient {
  private rpcUrl: string;
  private requestId: number = 0;

  constructor(rpcUrl: string) {
    this.rpcUrl = rpcUrl;
  }

  /**
   * Make a JSON-RPC call
   */
  async call<TParams = unknown[], TResult = unknown>(
    method: string,
    params: TParams
  ): Promise<TResult> {
    this.requestId++;

    const request: JsonRpcRequest<TParams> = {
      jsonrpc: '2.0',
      id: this.requestId,
      method,
      params,
    };

    const response = await fetch(this.rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`RPC request failed: ${response.status} ${response.statusText}`);
    }

    const jsonResponse = await response.json() as JsonRpcResponse<TResult>;

    if (jsonResponse.error) {
      throw new Error(
        `RPC error ${jsonResponse.error.code}: ${jsonResponse.error.message}`
      );
    }

    if (jsonResponse.result === undefined) {
      throw new Error('RPC response missing result field');
    }

    return jsonResponse.result;
  }

  /**
   * Update the RPC URL
   */
  setRpcUrl(rpcUrl: string): void {
    this.rpcUrl = rpcUrl;
  }

  /**
   * Get the current RPC URL
   */
  getRpcUrl(): string {
    return this.rpcUrl;
  }
}

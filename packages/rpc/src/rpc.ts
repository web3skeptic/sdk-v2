import { RpcClient } from './client';
import {
  CirclesV2Methods,
  QueryMethods,
  TrustMethods,
  BalanceMethods,
  AvatarMethods,
  ProfileMethods,
  TokenMethods,
  InvitationMethods,
} from './methods';

/**
 * Main RPC class for Circles protocol RPC interactions
 *
 * @example
 * ```typescript
 * // Use default RPC endpoint
 * const rpc = new CirclesRpc();
 *
 * // Use custom RPC endpoint
 * const rpc = new CirclesRpc('https://rpc.circlesubi.network/');
 *
 * // Get total balance
 * const balance = await rpc.circlesV2.getTotalBalance('0xcadd4ea3bcc361fc4af2387937d7417be8d7dfc2');
 *
 * // Find a path
 * const path = await rpc.circlesV2.findPath({
 *   Source: '0x749c930256b47049cb65adcd7c25e72d5de44b3b',
 *   Sink: '0xde374ece6fa50e781e81aac78e811b33d16912c7',
 *   TargetFlow: '99999999999999999999999999999999999'
 * });
 *
 * // Query trust relations
 * const trustRelations = await rpc.query.query({
 *   Namespace: 'V_CrcV2',
 *   Table: 'TrustRelations',
 *   Columns: [],
 *   Filter: [],
 *   Order: []
 * });
 *
 * // Get profile
 * const profile = await rpc.profile.getProfileByAddress('0xc3a1428c04c426cdf513c6fc8e09f55ddaf50cd7');
 * ```
 */
export class CirclesRpc {
  public readonly client: RpcClient;
  public readonly circlesV2: CirclesV2Methods;
  public readonly query: QueryMethods;
  public readonly trust: TrustMethods;
  public readonly balance: BalanceMethods;
  public readonly avatar: AvatarMethods;
  public readonly profile: ProfileMethods;
  public readonly token: TokenMethods;
  public readonly invitation: InvitationMethods;

  /**
   * Create a new CirclesRpc instance
   *
   * @param rpcUrl RPC URL to use (defaults to https://rpc.circlesubi.network/)
   */
  constructor(rpcUrl: string = 'https://rpc.circlesubi.network/') {
    this.client = new RpcClient(rpcUrl);

    this.circlesV2 = new CirclesV2Methods(this.client);
    this.query = new QueryMethods(this.client);
    this.trust = new TrustMethods(this.client);
    this.balance = new BalanceMethods(this.client);
    this.avatar = new AvatarMethods(this.client);
    this.profile = new ProfileMethods(this.client);
    this.token = new TokenMethods(this.client);
    this.invitation = new InvitationMethods(this.client);
  }

  /**
   * Update the RPC URL
   */
  setRpcUrl(rpcUrl: string): void {
    this.client.setRpcUrl(rpcUrl);
  }

  /**
   * Get the current RPC URL
   */
  getRpcUrl(): string {
    return this.client.getRpcUrl();
  }
}

import type { Address } from './types';

/**
 * Circles protocol configuration for a specific chain
 */
export interface CirclesConfig {
  /** RPC URL for Circles-specific endpoints */
  circlesRpcUrl: string;
  /** Pathfinder service URL for computing transfer paths */
  pathfinderUrl: string;
  /** Profile service URL for user profiles and metadata */
  profileServiceUrl: string;
  /** Circles V1 Hub contract address */
  v1HubAddress: Address;
  /** Circles V2 Hub contract address */
  v2HubAddress: Address;
  /** Name Registry contract address */
  nameRegistryAddress: Address;
  /** Base Group Mint Policy contract address */
  baseGroupMintPolicy: Address;
  /** Standard Treasury contract address */
  standardTreasury: Address;
  /** Core Members Group Deployer contract address */
  coreMembersGroupDeployer: Address;
  /** Base Group Factory contract address */
  baseGroupFactoryAddress: Address;
  /** Lift ERC20 contract address */
  liftERC20Address: Address;
}

/**
 * Default Circles configurations by chain ID
 *
 * Chain IDs:
 * - 100: Gnosis Chain (mainnet)
 */
export const circlesConfig: { [chainId: number]: CirclesConfig } = {
  100: {
    circlesRpcUrl: "https://rpc.aboutcircles.com/",
    pathfinderUrl: "https://pathfinder.aboutcircles.com",
    profileServiceUrl: "https://rpc.aboutcircles.com/profiles/",
    v1HubAddress: "0x29b9a7fbb8995b2423a71cc17cf9810798f6c543",
    v2HubAddress: "0xc12C1E50ABB450d6205Ea2C3Fa861b3B834d13e8",
    nameRegistryAddress: "0xA27566fD89162cC3D40Cb59c87AAaA49B85F3474",
    baseGroupMintPolicy: "0xcCa27c26CF7BAC2a9928f42201d48220F0e3a549",
    standardTreasury: "0x08F90aB73A515308f03A718257ff9887ED330C6e",
    coreMembersGroupDeployer: "0xFEca40Eb02FB1f4F5F795fC7a03c1A27819B1Ded",
    baseGroupFactoryAddress: "0xD0B5Bd9962197BEaC4cbA24244ec3587f19Bd06d",
    liftERC20Address: "0x5F99a795dD2743C36D63511f0D4bc667e6d3cDB5"
  }
};

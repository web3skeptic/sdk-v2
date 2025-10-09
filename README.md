# Circles SDK v2

A comprehensive TypeScript SDK for the Circles protocol.

## Overview

The Circles SDK consists of two main packages:

- **[@circles-sdk/core](./packages/core/)** - Contract wrappers for direct blockchain interaction
- **[@circles-sdk/rpc](./packages/rpc/)** - RPC client for querying Circles data and finding transfer paths

## Quick Start

### Installation

```bash
# Install dependencies
bun install

# Build all packages
bun run build
```

### Basic Usage

#### Core SDK - Contract Interaction

```typescript
import { Core } from '@circles-sdk/core';

// Initialize with default Gnosis Chain configuration
const core = new Core();

// Create a group mint transaction
const tx = core.hubV2.groupMint(
  '0x1234567890123456789012345678901234567890',
  ['0xRecipient1', '0xRecipient2'],
  [BigInt(100), BigInt(200)],
  '0x'
);
```

#### RPC SDK - Data Queries

```typescript
import { CirclesRpc } from '@circles-sdk/rpc';

// Initialize RPC client
const rpc = new CirclesRpc('https://rpc.circlesubi.network/');

// Get total balance
const balance = await rpc.circlesV2.getTotalBalance('0xYourAddress');

// Find a transfer path
const path = await rpc.circlesV2.findPath({
  from: '0xSenderAddress',
  to: '0xRecipientAddress',
  targetFlow: BigInt(100)
});
```

## Examples

Comprehensive examples are available in the [`examples/`](./examples/) directory:

### Core SDK Examples

- **[01-basic-usage.ts](./examples/core/01-basic-usage.ts)** - SDK initialization and configuration
- **[02-hubv2-examples.ts](./examples/core/02-hubv2-examples.ts)** - HubV2 contract operations
- **[03-basegroup-examples.ts](./examples/core/03-basegroup-examples.ts)** - BaseGroup creation and management

### RPC SDK Examples

- **[01-basic-rpc.ts](./examples/rpc/01-basic-rpc.ts)** - RPC client configuration
- **[02-circlesv2-balance-and-pathfinding.ts](./examples/rpc/02-circlesv2-balance-and-pathfinding.ts)** - Balance queries and pathfinding
- **[03-query-examples.ts](./examples/rpc/03-query-examples.ts)** - Advanced query operations
- **[04-trust-examples.ts](./examples/rpc/04-trust-examples.ts)** - Trust relationship queries
- **[05-balance-examples.ts](./examples/rpc/05-balance-examples.ts)** - Token balance operations
- **[06-avatar-examples.ts](./examples/rpc/06-avatar-examples.ts)** - Avatar information queries
- **[07-profile-examples.ts](./examples/rpc/07-profile-examples.ts)** - Profile operations

### Running Examples

```bash
# Run all examples
bun run examples

# Run core examples only
bun run example:core

# Run RPC examples only
bun run example:rpc

# Run individual example
bun run examples/core/01-basic-usage.ts
```

See the [Examples README](./examples/README.md) for detailed documentation.

## Packages

### @circles-sdk/core

Contract wrappers for direct blockchain interaction with the Circles protocol.

**Features:**
- Full TypeScript type safety with abitype
- HubV2 contract wrapper (singleton)
- BaseGroup contract wrapper (multiple instances)
- BaseGroupFactory for creating groups
- Custom RPC URL support

[View Core SDK Documentation →](./packages/core/README.md)

### @circles-sdk/rpc

RPC client for querying Circles data and finding transfer paths.

**Features:**
- CirclesV2 methods (balance, pathfinding)
- Query operations (tables, events, custom queries)
- Trust relationship operations
- Balance operations
- Avatar information queries
- Profile operations
- All numeric values returned as `bigint` for safe handling

[View RPC SDK Documentation →](./packages/rpc/README.md)

## Development

### Building

```bash
# Build all packages
bun run build

# Build specific package
bun run build:core
bun run build:rpc
```

### Development Mode

```bash
# Watch mode for all packages
bun run dev

# Watch mode for specific package
bun run dev:core
bun run dev:rpc
```

### Clean

```bash
# Remove all build artifacts and node_modules
bun run clean
```

## Project Structure

```
new-sdk/
├── examples/              # Comprehensive SDK examples
│   ├── core/             # Core SDK examples
│   └── rpc/              # RPC SDK examples
├── packages/
│   ├── core/             # Contract wrapper package
│   └── rpc/              # RPC client package
├── package.json          # Workspace configuration
└── tsconfig.json         # TypeScript configuration
```

## Scripts

- `bun run build` - Build all packages
- `bun run build:core` - Build core package
- `bun run build:rpc` - Build RPC package
- `bun run dev` - Watch mode for all packages
- `bun run dev:core` - Watch mode for core package
- `bun run dev:rpc` - Watch mode for RPC package
- `bun run examples` - Run all examples
- `bun run example:core` - Run core examples
- `bun run example:rpc` - Run RPC examples
- `bun run clean` - Clean build artifacts and node_modules

## TypeScript

This project uses TypeScript with strict type checking. Type definitions are automatically generated during the build process.

## License

MIT

# Circles SDK v2

A comprehensive TypeScript SDK for the Circles protocol.

## 📚 API Documentation

**[View Complete API Documentation →](./docs/README.md)**

Package documentation:
- [@aboutcircles/sdk](./docs/sdk/src/README.md) - Main SDK package
- [@aboutcircles/sdk-core](./docs/core/src/README.md) - Contract wrappers
- [@aboutcircles/sdk-rpc](./docs/rpc/src/README.md) - RPC client
- [@aboutcircles/sdk-types](./docs/types/src/README.md) - TypeScript types
- [@aboutcircles/sdk-abis](./docs/abis/src/README.md) - Contract ABIs
- [@aboutcircles/sdk-utils](./docs/utils/src/README.md) - Utilities
- [@aboutcircles/sdk-profiles](./docs/profiles/src/README.md) - Profile management
- [@aboutcircles/sdk-pathfinder](./docs/pathfinder/src/README.md) - Transfer pathfinding
- [@aboutcircles/sdk-transfers](./docs/transfers/src/README.md) - Transitive transfer operations
- [@aboutcircles/sdk-runner](./docs/runner/src/README.md) - Transaction execution

## 🚀 Quick Start

### Installation

```bash
bun install
bun run build
```

### Basic Usage

**Core SDK - Contract Interaction**

```typescript
import { Core } from '@aboutcircles/sdk-core';

const core = new Core();

const tx = core.hubV2.groupMint(
  '0x1234567890123456789012345678901234567890',
  ['0xRecipient1', '0xRecipient2'],
  [BigInt(100), BigInt(200)],
  '0x'
);
```

**RPC SDK - Data Queries**

```typescript
import { CirclesRpc } from '@aboutcircles/sdk-rpc';

const rpc = new CirclesRpc('https://rpc.circlesubi.network/');

// Get balance
const balance = await rpc.circlesV2.getTotalBalance('0xYourAddress');

// Find transfer path
const path = await rpc.circlesV2.findPath({
  from: '0xSenderAddress',
  to: '0xRecipientAddress',
  targetFlow: BigInt(100)
});
```

## 📦 Packages

- **[@aboutcircles/sdk](./packages/sdk/)** - Main SDK package
- **[@aboutcircles/sdk-core](./packages/core/)** - Contract wrappers for direct blockchain interaction
- **[@aboutcircles/sdk-rpc](./packages/rpc/)** - RPC client for querying Circles data and pathfinding
- **[@aboutcircles/sdk-types](./packages/types/)** - Shared TypeScript types
- **[@aboutcircles/sdk-abis](./packages/abis/)** - Contract ABIs
- **[@aboutcircles/sdk-utils](./packages/utils/)** - Utility functions
- **[@aboutcircles/sdk-profiles](./packages/profiles/)** - Profile management
- **[@aboutcircles/sdk-pathfinder](./packages/pathfinder/)** - Transfer pathfinding algorithms
- **[@aboutcircles/sdk-transfers](./packages/transfers/)** - Transfer operations
- **[@aboutcircles/sdk-runner](./packages/runner/)** - Transaction execution

## 💡 Examples

Explore comprehensive examples in the [`examples/`](./examples/) directory:

**Core SDK:**
- [Basic Usage](./examples/core/01-basic-usage.ts) - SDK initialization
- [HubV2 Operations](./examples/core/02-hubv2-examples.ts) - Contract operations
- [BaseGroup Management](./examples/core/03-basegroup-examples.ts) - Group creation

**RPC SDK:**
- [RPC Client](./examples/rpc/01-basic-rpc.ts) - Client configuration
- [Balance & Pathfinding](./examples/rpc/02-circlesv2-balance-and-pathfinding.ts)
- [Trust Relations](./examples/rpc/04-trust-examples.ts)
- [Avatar Info](./examples/rpc/06-avatar-examples.ts)
- [Profiles](./examples/rpc/07-profile-examples.ts)

[View all examples →](./examples/README.md)

**Run examples:**
```bash
bun run examples                           # All examples
bun run examples/core/01-basic-usage.ts    # Specific example
```

## 🛠️ Development

```bash
# Build
bun run build              # All packages
bun run build:core         # Core package
bun run build:rpc          # RPC package

# Development (watch mode)
bun run dev               # All packages
bun run dev:core          # Core package

# Documentation
bun run docs              # Generate API docs

# Publishing
bun run publish           # Build and publish all packages

# Clean
bun run clean             # Remove build artifacts
```

## 📄 License

MIT

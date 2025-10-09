# Circles SDK Examples

This directory contains comprehensive examples for using the Circles SDK. The examples are organized into two main categories:

- **Core SDK Examples** (`/examples/core/`) - Contract interaction examples
- **RPC SDK Examples** (`/examples/rpc/`) - RPC API interaction examples

## Table of Contents

- [Getting Started](#getting-started)
- [Core SDK Examples](#core-sdk-examples)
- [RPC SDK Examples](#rpc-sdk-examples)
- [Running Examples](#running-examples)

## Getting Started

Before running any examples, make sure you have:

1. Installed all dependencies:
   ```bash
   bun install
   ```

2. Built the SDK packages:
   ```bash
   bun run build
   ```

## Core SDK Examples

The Core SDK provides direct contract interaction capabilities for the Circles protocol.

### 01 - Basic Usage
**File:** `core/01-basic-usage.ts`

Learn how to initialize the Core SDK with different configurations:
- Default Gnosis Chain configuration
- Custom RPC URLs
- Accessing contract addresses and configuration

```bash
bun run examples/core/01-basic-usage.ts
```

### 02 - HubV2 Contract
**File:** `core/02-hubv2-examples.ts`

Interact with the HubV2 contract (the main Circles protocol contract):
- Group mint operations
- Personal mint operations
- Trust operations

```bash
bun run examples/core/02-hubv2-examples.ts
```

### 03 - BaseGroup Contract
**File:** `core/03-basegroup-examples.ts`

Work with BaseGroup contracts for group management:
- Creating new groups using the factory
- Interacting with existing group instances
- Managing trust relationships within groups

```bash
bun run examples/core/03-basegroup-examples.ts
```

## RPC SDK Examples

The RPC SDK provides access to the Circles RPC API for querying data and finding transfer paths.

### 01 - Basic RPC Configuration
**File:** `rpc/01-basic-rpc.ts`

Learn the basics of the CirclesRpc client:
- Initializing with different endpoints
- Changing RPC URLs dynamically
- Understanding available method groups

```bash
bun run examples/rpc/01-basic-rpc.ts
```

### 02 - CirclesV2 Balance and Pathfinding
**File:** `rpc/02-circlesv2-balance-and-pathfinding.ts`

Master balance queries and pathfinding:
- Getting total v2 Circles balances
- Finding transfer paths between addresses
- Circular paths (token swaps)

```bash
bun run examples/rpc/02-circlesv2-balance-and-pathfinding.ts
```

### 03 - Query Operations
**File:** `rpc/03-query-examples.ts`

Learn advanced query capabilities:
- Querying available tables
- Querying events
- Custom queries with filters
- Sorting and filtering results

```bash
bun run examples/rpc/03-query-examples.ts
```

### 04 - Trust Operations
**File:** `rpc/04-trust-examples.ts`

Work with trust relationships:
- Getting common trust connections between addresses

```bash
bun run examples/rpc/04-trust-examples.ts
```

### 05 - Balance Operations
**File:** `rpc/05-balance-examples.ts`

Query token balances:
- Getting all token balances for an address

```bash
bun run examples/rpc/05-balance-examples.ts
```

### 06 - Avatar Operations
**File:** `rpc/06-avatar-examples.ts`

Retrieve avatar information:
- Getting detailed avatar information
- Retrieving network snapshots

```bash
bun run examples/rpc/06-avatar-examples.ts
```

### 07 - Profile Operations
**File:** `rpc/07-profile-examples.ts`

Work with user profiles:
- Getting profiles by CID
- Getting profiles by address
- Batch profile retrieval
- Searching profiles

```bash
bun run examples/rpc/07-profile-examples.ts
```

## Running Examples

There are several ways to run the examples:

### Run Individual Examples

Run any example file directly with bun:

```bash
bun run examples/core/01-basic-usage.ts
bun run examples/rpc/02-circlesv2-balance-and-pathfinding.ts
```

### Run All Core Examples

```bash
bun run example:core
```

### Run All RPC Examples

```bash
bun run example:rpc
```

### Run All Examples

```bash
bun run examples
```

## Example Structure

Each example file follows this structure:

1. **Import statements** - Import the necessary SDK components
2. **Documentation** - Clear comments explaining what the example demonstrates
3. **Example functions** - Individual functions for each example
4. **Commented execution** - Example calls are commented out by default

To run the async functions in RPC examples, uncomment the function calls at the bottom of the file or call them manually.

## Important Notes

### Core Examples
- Core examples demonstrate **transaction building**, not execution
- To execute transactions, you need to connect a wallet and send the transactions to the network
- The examples show the transaction data structure that would be sent

### RPC Examples
- RPC examples make **actual API calls** to the Circles RPC endpoint
- Some examples may take a few seconds to complete
- Make sure you have an active internet connection
- The default RPC endpoint is `https://rpc.circlesubi.network/`

## Next Steps

After exploring these examples:

1. Read the full [SDK documentation](../README.md)
2. Check out the [Core SDK README](../packages/core/README.md)
3. Check out the [RPC SDK README](../packages/rpc/README.md)
4. Start building your own Circles application!

## Need Help?

If you have questions or run into issues:

- Check the main [README](../README.md)
- Review the inline comments in the example files
- Open an issue on GitHub

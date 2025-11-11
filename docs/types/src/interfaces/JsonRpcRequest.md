[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [types/src](../README.md) / JsonRpcRequest

# Interface: JsonRpcRequest\<TParams\>

Defined in: [packages/types/src/rpc.ts:8](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/rpc.ts#L8)

JSON-RPC request structure

## Type Parameters

### TParams

`TParams` = `unknown`[]

## Properties

### jsonrpc

```ts
jsonrpc: "2.0";
```

Defined in: [packages/types/src/rpc.ts:9](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/rpc.ts#L9)

***

### id

```ts
id: string | number;
```

Defined in: [packages/types/src/rpc.ts:10](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/rpc.ts#L10)

***

### method

```ts
method: string;
```

Defined in: [packages/types/src/rpc.ts:11](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/rpc.ts#L11)

***

### params

```ts
params: TParams;
```

Defined in: [packages/types/src/rpc.ts:12](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/types/src/rpc.ts#L12)

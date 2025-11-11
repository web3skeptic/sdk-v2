[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / BaseErrorSource

# Type Alias: BaseErrorSource

```ts
type BaseErrorSource = 
  | "UTILS"
  | "RPC"
  | "SDK"
  | "CORE"
  | "RUNNER"
  | "PROFILES"
  | "TRANSFERS"
  | "EVENTS"
  | "PATHFINDER"
  | "UNKNOWN";
```

Defined in: [packages/utils/src/errors.ts:10](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/utils/src/errors.ts#L10)

Base error source type
Each package exports its own specific ErrorSource

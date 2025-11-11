[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [pathfinder/src](../README.md) / replaceWrappedTokensWithAvatars

# Function: replaceWrappedTokensWithAvatars()

```ts
function replaceWrappedTokensWithAvatars(path, tokenInfoMap): PathfindingResult;
```

Defined in: [packages/pathfinder/src/path.ts:82](https://github.com/aboutcircles/sdk-v2/blob/aed3c8bf419f1e90d91722752d3f29c8257367c2/packages/pathfinder/src/path.ts#L82)

Replace wrapped token addresses with avatar addresses in the path
This is used after unwrapping to reflect the actual tokens being transferred

## Parameters

### path

`PathfindingResult`

### tokenInfoMap

`Map`\<`string`, `TokenInfo`\>

## Returns

`PathfindingResult`

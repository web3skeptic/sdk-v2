[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / parseContractError

# Function: parseContractError()

> **parseContractError**(`error`, `abi`): [`DecodedContractError`](../../../types/src/interfaces/DecodedContractError.md) \| `null`

Defined in: [packages/utils/src/contractErrors.ts:153](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/contractErrors.ts#L153)

Parse contract error from a transaction error

## Parameters

### error

`any`

The error object from a failed transaction

### abi

`Abi`

The contract ABI to use for decoding

## Returns

[`DecodedContractError`](../../../types/src/interfaces/DecodedContractError.md) \| `null`

Decoded error information or null if cannot be parsed

## Example

```typescript
try {
  await contract.someFunction();
} catch (error) {
  const decoded = parseContractError(error, hubV2Abi);
  if (decoded) {
    console.log(`Contract error: ${decoded.formattedMessage}`);
  }
}
```

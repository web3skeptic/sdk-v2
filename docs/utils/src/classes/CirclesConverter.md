[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [utils/src](../README.md) / CirclesConverter

# Class: CirclesConverter

Defined in: [packages/utils/src/circlesConverter.ts:7](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L7)

Conversions between demurrage and inflationary units in V2 – bit‑identical with the
Solidity reference implementation (ABDK Math 64.64).

All fixed‑point math uses ABDK’s 64.64 format encoded in `bigint`.

## Constructors

### Constructor

> **new CirclesConverter**(): `CirclesConverter`

#### Returns

`CirclesConverter`

## Properties

### ONE\_64

> `readonly` `static` **ONE\_64**: `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:11](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L11)

1.0 in 64.64 representation

***

### GAMMA\_64

> `readonly` `static` **GAMMA\_64**: `bigint` = `18_443_079_296_116_538_654n`

Defined in: [packages/utils/src/circlesConverter.ts:14](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L14)

GAMMA = (0.93)^(1/365.25) * 2^64

***

### BETA\_64

> `readonly` `static` **BETA\_64**: `bigint` = `18_450_409_579_521_241_655n`

Defined in: [packages/utils/src/circlesConverter.ts:16](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L16)

BETA = 1 / GAMMA * 2^64

***

### SECONDS\_PER\_DAY

> `readonly` `static` **SECONDS\_PER\_DAY**: `bigint` = `86_400n`

Defined in: [packages/utils/src/circlesConverter.ts:18](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L18)

***

### INFLATION\_DAY\_ZERO\_UNIX

> `readonly` `static` **INFLATION\_DAY\_ZERO\_UNIX**: `bigint` = `1_602_720_000n`

Defined in: [packages/utils/src/circlesConverter.ts:19](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L19)

***

### ATTO\_FACTOR

> `readonly` `static` **ATTO\_FACTOR**: `bigint` = `1_000_000_000_000_000_000n`

Defined in: [packages/utils/src/circlesConverter.ts:21](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L21)

***

### FACTOR\_1E12

> `readonly` `static` **FACTOR\_1E12**: `bigint` = `1_000_000_000_000n`

Defined in: [packages/utils/src/circlesConverter.ts:22](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L22)

***

### V1\_ACCURACY

> `readonly` `static` **V1\_ACCURACY**: `bigint` = `100_000_000n`

Defined in: [packages/utils/src/circlesConverter.ts:24](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L24)

***

### V1\_INFLATION\_PCT\_NUM

> `readonly` `static` **V1\_INFLATION\_PCT\_NUM**: `bigint` = `107n`

Defined in: [packages/utils/src/circlesConverter.ts:25](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L25)

***

### V1\_INFLATION\_PCT\_DEN

> `readonly` `static` **V1\_INFLATION\_PCT\_DEN**: `bigint` = `100n`

Defined in: [packages/utils/src/circlesConverter.ts:26](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L26)

***

### PERIOD\_SEC

> `readonly` `static` **PERIOD\_SEC**: `bigint` = `31_556_952n`

Defined in: [packages/utils/src/circlesConverter.ts:27](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L27)

## Methods

### attoCirclesToCircles()

> `static` **attoCirclesToCircles**(`atto`): `number`

Defined in: [packages/utils/src/circlesConverter.ts:105](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L105)

Atto‑circles (1e18) → UI circles as JS number (lossless until 2^53‑1).

#### Parameters

##### atto

`bigint`

#### Returns

`number`

***

### circlesToAttoCircles()

> `static` **circlesToAttoCircles**(`circles`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:121](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L121)

UI circles → atto‑circles (truncates to match Solidity’s rounding).

#### Parameters

##### circles

`number`

#### Returns

`bigint`

***

### inflationaryToDemurrage()

> `static` **inflationaryToDemurrage**(`inflationary`, `day`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:128](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L128)

Inflationary → demurraged for explicit day index.

#### Parameters

##### inflationary

`bigint`

##### day

`bigint`

#### Returns

`bigint`

***

### demurrageToInflationary()

> `static` **demurrageToInflationary**(`demurraged`, `day`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:133](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L133)

Demurraged → inflationary for explicit day index.

#### Parameters

##### demurraged

`bigint`

##### day

`bigint`

#### Returns

`bigint`

***

### dayFromTimestamp()

> `static` **dayFromTimestamp**(`unixSeconds`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:138](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L138)

UNIX timestamp (seconds) → Circles day index.

#### Parameters

##### unixSeconds

`bigint`

#### Returns

`bigint`

***

### attoCirclesToAttoStaticCircles()

> `static` **attoCirclesToAttoStaticCircles**(`demurraged`, `nowUnixSeconds`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:143](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L143)

Demurraged → static circles for “today”.

#### Parameters

##### demurraged

`bigint`

##### nowUnixSeconds

`bigint` = `...`

#### Returns

`bigint`

***

### attoStaticCirclesToAttoCircles()

> `static` **attoStaticCirclesToAttoCircles**(`staticCircles`, `nowUnixSeconds`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:151](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L151)

Static circles → demurraged circles for “today”.

#### Parameters

##### staticCircles

`bigint`

##### nowUnixSeconds

`bigint` = `...`

#### Returns

`bigint`

***

### inflationaryToDemurrageExact()

> `static` **inflationaryToDemurrageExact**(`inflationary`, `day`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:159](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L159)

Inflationary → demurraged (exact, reversible).

#### Parameters

##### inflationary

`bigint`

##### day

`bigint`

#### Returns

`bigint`

***

### demurrageToInflationaryExact()

> `static` **demurrageToInflationaryExact**(`demurraged`, `day`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:165](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L165)

Demurraged → inflationary (inverse of the above, exact).

#### Parameters

##### demurraged

`bigint`

##### day

`bigint`

#### Returns

`bigint`

***

### attoCirclesToAttoStaticCirclesExact()

> `static` **attoCirclesToAttoStaticCirclesExact**(`demurraged`, `nowUnixSeconds`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:171](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L171)

Demurraged atto-circles → static atto-circles “today” (loss-less).

#### Parameters

##### demurraged

`bigint`

##### nowUnixSeconds

`bigint` = `...`

#### Returns

`bigint`

***

### attoStaticCirclesToAttoCirclesExact()

> `static` **attoStaticCirclesToAttoCirclesExact**(`staticCircles`, `nowUnixSeconds`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:180](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L180)

Static atto-circles → demurraged atto-circles “today” (loss-less).

#### Parameters

##### staticCircles

`bigint`

##### nowUnixSeconds

`bigint` = `...`

#### Returns

`bigint`

***

### truncateToInt64()

> `static` **truncateToInt64**(`wei`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:190](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L190)

#### Parameters

##### wei

`bigint`

#### Returns

`bigint`

***

### blowUpToBigInt()

> `static` **blowUpToBigInt**(`sixDecimals`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:196](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L196)

#### Parameters

##### sixDecimals

`bigint`

#### Returns

`bigint`

***

### truncateToSixDecimals()

> `static` **truncateToSixDecimals**(`wei`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:200](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L200)

#### Parameters

##### wei

`bigint`

#### Returns

`bigint`

***

### attoCrcToAttoCircles()

> `static` **attoCrcToAttoCircles**(`v1Amount`, `blockTimestampUtc`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:212](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L212)

CRC → demurraged Circles for a given timestamp.

#### Parameters

##### v1Amount

`bigint`

##### blockTimestampUtc

`bigint`

#### Returns

`bigint`

***

### attoCirclesToAttoCrc()

> `static` **attoCirclesToAttoCrc**(`demurraged`, `blockTimestampUtc`): `bigint`

Defined in: [packages/utils/src/circlesConverter.ts:222](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/utils/src/circlesConverter.ts#L222)

Demurraged Circles → CRC (inverse of the above).

#### Parameters

##### demurraged

`bigint`

##### blockTimestampUtc

`bigint`

#### Returns

`bigint`

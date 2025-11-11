[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [sdk/src](../README.md) / SdkError

# Class: SdkError

Defined in: [packages/sdk/src/errors.ts:19](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L19)

SDK-related errors

## Extends

- `CirclesError`\<[`SdkErrorSource`](../type-aliases/SdkErrorSource.md)\>

## Constructors

### Constructor

> **new SdkError**(`message`, `options?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:20](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L20)

#### Parameters

##### message

`string`

##### options?

###### code?

`string` \| `number`

###### source?

[`SdkErrorSource`](../type-aliases/SdkErrorSource.md)

###### cause?

`unknown`

###### context?

`Record`\<`string`, `any`\>

#### Returns

`SdkError`

#### Overrides

`CirclesError<SdkErrorSource>.constructor`

## Methods

### notInitialized()

> `static` **notInitialized**(`component`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:35](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L35)

Create error for uninitialized components

#### Parameters

##### component

`string`

#### Returns

`SdkError`

***

### unsupportedOperation()

> `static` **unsupportedOperation**(`operation`, `reason?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:46](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L46)

Create error for unsupported operations

#### Parameters

##### operation

`string`

##### reason?

`string`

#### Returns

`SdkError`

***

### configError()

> `static` **configError**(`message`, `context?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:60](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L60)

Create error for configuration issues

#### Parameters

##### message

`string`

##### context?

`Record`\<`string`, `any`\>

#### Returns

`SdkError`

***

### operationFailed()

> `static` **operationFailed**(`operation`, `reason`, `cause?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:71](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L71)

Create error for failed operations

#### Parameters

##### operation

`string`

##### reason

`string`

##### cause?

`unknown`

#### Returns

`SdkError`

***

### missingContractRunner()

> `static` **missingContractRunner**(`operation?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:83](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L83)

Create error for missing contract runner

#### Parameters

##### operation?

`string`

#### Returns

`SdkError`

***

### avatarNotFound()

> `static` **avatarNotFound**(`address`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:99](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L99)

Create error for avatar not found

#### Parameters

##### address

`string`

#### Returns

`SdkError`

***

### invalidProfile()

> `static` **invalidProfile**(`reason`, `context?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:110](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L110)

Create error for invalid profile

#### Parameters

##### reason

`string`

##### context?

`Record`\<`string`, `any`\>

#### Returns

`SdkError`

***

### profileOperationFailed()

> `static` **profileOperationFailed**(`operation`, `reason`, `cause?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:121](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L121)

Create error for profile operation failures

#### Parameters

##### operation

`string`

##### reason

`string`

##### cause?

`unknown`

#### Returns

`SdkError`

***

### insufficientBalance()

> `static` **insufficientBalance**(`required`, `available`, `token?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:133](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L133)

Create error for insufficient balance

#### Parameters

##### required

`string`

##### available

`string`

##### token?

`string`

#### Returns

`SdkError`

***

### transactionDataExtractionFailed()

> `static` **transactionDataExtractionFailed**(`dataType`, `reason?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:149](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L149)

Create error for transaction extraction failures

#### Parameters

##### dataType

`string`

##### reason?

`string`

#### Returns

`SdkError`

***

### registrationFailed()

> `static` **registrationFailed**(`avatarType`, `reason`, `cause?`): `SdkError`

Defined in: [packages/sdk/src/errors.ts:165](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/sdk/src/errors.ts#L165)

Create error for registration failures

#### Parameters

##### avatarType

`string`

##### reason

`string`

##### cause?

`unknown`

#### Returns

`SdkError`

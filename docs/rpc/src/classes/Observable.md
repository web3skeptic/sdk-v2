[**Circles SDK**](../../../README.md)

***

[Circles SDK](../../../modules.md) / [rpc/src](../README.md) / Observable

# Class: Observable\<TEvent\>

Defined in: [packages/rpc/src/events/observable.ts:5](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/events/observable.ts#L5)

Observable class for event streaming
Provides a simple publish-subscribe pattern for Circles events

## Type Parameters

### TEvent

`TEvent`

## Constructors

### Constructor

> `protected` **new Observable**\<`TEvent`\>(): `Observable`\<`TEvent`\>

Defined in: [packages/rpc/src/events/observable.ts:23](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/events/observable.ts#L23)

#### Returns

`Observable`\<`TEvent`\>

## Methods

### subscribe()

> **subscribe**(`subscriber`): () => `void`

Defined in: [packages/rpc/src/events/observable.ts:13](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/events/observable.ts#L13)

Subscribe to events

#### Parameters

##### subscriber

(`value`) => `void`

Callback function to be called for each event

#### Returns

Unsubscribe function to stop receiving events

> (): `void`

##### Returns

`void`

***

### emit()

> `protected` **emit**(`value`): `void`

Defined in: [packages/rpc/src/events/observable.ts:27](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/events/observable.ts#L27)

#### Parameters

##### value

`TEvent`

#### Returns

`void`

***

### create()

> `static` **create**\<`T`\>(): `object`

Defined in: [packages/rpc/src/events/observable.ts:34](https://github.com/aboutcircles/sdk-v2/blob/71cffbae585b19dfb4a8e752b25f9afcf9e11b66/packages/rpc/src/events/observable.ts#L34)

Create a new Observable with an emitter

#### Type Parameters

##### T

`T`

#### Returns

`object`

##### property

> **property**: `Observable`\<`T`\>

##### emit()

> **emit**: (`e`) => `void`

###### Parameters

###### e

`T`

###### Returns

`void`

# CombinableReducers

1. ***Helper Function*** returning an object consumable by [redux `combineReducers`](https://redux.js.org/docs/api/combineReducers.html).


## Signature

```typescript
/**
 * @param {...{ toString(): string }} reducers
 *
 * @returns An object whose keys are domain names
 * and values correspond to different reducer.
**/
function createCombinableReducers(...reducers) { /* ... */ };
```

## Usage

```typescript
import { combineReducers } from 'redux';
import { createCombinableReducers, createReducer } from 'redux-fluent';

const reducerA = createReducer('Hello World').default();
const reducerB = createReducer('Hello Earth').default();
const reducerN = createReducer('Hello Planet').default();

const reducers = createCombinableReducers(reducerA, reducerB, reducerN);
{
  'Hello World': reducerA,
  'Hello Earth': reducerB,
  'Hello Planet': reducerN,
}

export const combineReducers(reducers);
```

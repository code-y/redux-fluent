# combineReducers

Outputs a root reducer as described in https://redux.js.org/api/combinereducers

> This is a secondary API, not needed for a basic integration with redux.

## Arguments

- `(...ReduxFluentReducer) => Reducer` - a list of redux-fluent reducers

## Returns

- `Reducer`

## Usages

```typescript
import { combineReducers } from 'redux-fluent'; 
import { reducers } from './store/reducers';

combineReducers(...reducers);
```

## Motivation

Similarly to [`redux-fluent#createReducersMapObject`](createReducersMapObject.md), this api helps to infer the global state interface automatically.

```typescript
import { combineReducers } from 'redux-fluent';
import { counterReducer } from './counter';
import { todosReducer } from './todos';

export const createRootReducer = () => combineReducers(
  counterReducer,
  todosReducer,
);
```

- This API works with any reducer that implements the `{ name: string }` interface.

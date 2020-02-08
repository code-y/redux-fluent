# createReducersMapObject

Outputs a [`ReducersMapObject`](https://github.com/reduxjs/redux/blob/master/src/types/reducers.ts#L39)
from a list of redux-fluent reducers.

> This is a secondary API, not needed for a basic integration with redux.

## Arguments

- `(...ReduxFluentReducer) => ReducersMapObject` - a list of redux-fluent reducers

## Returns

- `ReducersMapObject`

## Usages

```typescript
import { createReducersMapObject } from 'redux-fluent'; 
import { reducers } from './store/reducers';

createReducersMapObject(...reducers);
```

## Motivation

Standard redux reducers do not let you infer the shape of your global state by simply combining reducers together.
You need to define the global state interface by explicitly listing key-value pairs (`{ [name: string]: Reducer }`).

```typescript
import { combineReducers } from 'redux'; 
import { counterReducer } from './counter';
import { todosReducer } from './todos';

export const reducersMap = {
  counter: counterReducer,
  todos: todosReducer,
};

export const createRootReducer = combineReducers(reducersMap);
```

redux-fluent reducers are named reducers, so that the global state interface can be inferred automatically.

```typescript
import { combineReducers } from 'redux'; 
import { createReducersMapObject } from 'redux-fluent';
import { counterReducer } from './counter';
import { todosReducer } from './todos';

export const reducersMap = createReducersMapObject(counterReducer, todosReducer);

export const createRootReducer = () => combineReducers({
  ...reducersMap,
  nonReduxFluentReducer: (state, action) => state,
});
```

- This API works with any reducer that implements the `{ name: string }` interface.

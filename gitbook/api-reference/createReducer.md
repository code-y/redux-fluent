# createReducer

Factory function for creating redux-fluent reducers.

```typescript
import { createReducer } from 'redux-fluent';

createReducer(name).actions(...handlers).default(getDefaultState);
```

## Arguments
 - `string` - the name of the reducer
 
## Returns

```typescript
({ 
  actions: (...handlers) => ({ 
    default: (getDefaultState) => ReduxFluentReducer,
  }),
})
```

## Usage

Composes a redux-fluent reducer by combining handlers with the default state getter.

```typescript
createReducer('reducer-name')
  .actions(
    ...handlers
  )
  .default(getDefaultState);
```

### Handlers
- any function implementing the reducer interface `(state, action) => state`.

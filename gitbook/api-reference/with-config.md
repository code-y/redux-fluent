# withConfig

A reducer enhancer to enable Dependency Injection.  
If used, it provides a third new argument `config` to your action handlers.

```typescript
import { withConfig } from 'redux-fluent';

withConfig(config);
```

## Arguments

  - `{ [key: string]: any } | any` - config

## Returns

  - `<N, S, C>(reducer: ReduxFluentReducer<N, S, C>) => ReduxFluentReducer<N, S, C>`

## Usage

Injects dependencies into your action handlers

```typescript
import { pipe } from 'ramda';
import { withConfig } from 'redux-fluent';

export const enhancedReducer = pipe(
  withConfig({ a: doSomething, b: doSomethingElse }),
  withConfig({ b: overrideDoSomethingElse }),
)(reduxFluentReducer);
```

- configs are shallowly merged



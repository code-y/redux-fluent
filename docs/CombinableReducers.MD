# CombinableReducers

1. ***Helper Function*** which returns an object consumable by [redux `combineReducers`](https://redux.js.org/docs/api/combineReducers.html).


## Signature

```typescript
/**
 * @param {...{ toString(): string }} reducers
 *
 * @returns An object whose keys are domain name
 * and values correspond to different reducer.
**/
function createCombinableReducers(...reducers) { /* ... */ };
```

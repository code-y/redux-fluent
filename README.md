# <a href='https://github.com/Code-Y/redux-fluent'><img src='https://raw.githubusercontent.com/Code-Y/redux-fluent/master/redux-fluent-logo.png' height='60' alt='Redux Fluent' aria-label='https://github.com/Code-Y/redux-fluent' /></a> redux-fluent
[![Build Status](https://travis-ci.org/Code-Y/redux-fluent.svg?branch=master)](https://travis-ci.org/Code-Y/redux-fluent)
[![npm version](https://img.shields.io/npm/v/redux-fluent.svg)](https://www.npmjs.com/package/redux-fluent)
[![License](https://img.shields.io/npm/l/redux-fluent.svg)](https://github.com/Code-Y/redux-fluent/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![npm downloads](https://img.shields.io/npm/dm/redux-fluent.svg)](https://www.npmjs.com/package/redux-fluent)
[![Maintainability](https://api.codeclimate.com/v1/badges/2e98502fb6072892995d/maintainability)](https://codeclimate.com/github/Code-Y/redux-fluent/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/2e98502fb6072892995d/test_coverage)](https://codeclimate.com/github/Code-Y/redux-fluent/test_coverage)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/832b72aed6d24f65a88c54b6b6c467f3)](https://app.codacy.com/app/hitmands/redux-fluent)
[![Greenkeeper badge](https://badges.greenkeeper.io/Code-Y/redux-fluent.svg)](https://greenkeeper.io/)

Tiny and eloquent way of bringing redux to the next level (*~3K*, dependencies free, typings included).

[Try it out on RunKit](https://runkit.com/hitmands/redux-fluent-playground)

## Motivation

**[Redux](https://redux.js.org/)** is **great**, every recent web application has most likely been built on top of it, **and we can really make it better!**

- **λ Go Functional**, Everything is a function and reducers are built by function composition rather than piling up if and switch-case statements: [*Let's introduce Redux Fluent Reducers*](#createreducer).
- **Reducers at scale**, due to being handling multiple actions, reducers tend to grow and become difficult to maintain: [*Let's introduce Redux Fluent Action Handlers*](#oftype).
- **Less boilerplate**, Flux architecture is usually verbose and some of their concepts, such as `Action`, `Action Type` and `Action Creator` could all be implemented in a single entity: [*Let's introduce Redux Fluent Actions*](#createaction).
- **FSA compliance**, FSA Actions may have a `error: boolean` field, which indicates whether the action represents a failure or not. Respecting this pattern leads to a series of if statements inside reducers, compromising both readability and maintainability, so the community normally tends to split error and failures into two separate actions (eg: `ADD_TODO_SUCCESS` and `ADD_TODO_ERROR`) which reduces cognitive complexity on one hand but produces even more boilerplate on the other. *Let's embrace FSA and abstract error handling with filterable action handlers*.

## Installation

```
yarn add redux-fluent redux flux-standard-action
```

## Getting Started

```javascript
/** todos.actions.js **/
import { createAction } from 'redux-fluent';

export const addTodo = createAction('todos | add');
```

```javascript
/** todos.reducer.js **/
import { createReducer, ofType } from 'redux-fluent';
import * as actions from './todos.actions.js';

const addTodo = (state, { payload }) => state.concat(payload);

export const todos = createReducer('todos')
  .actions(
    ofType(actions.addTodo).map(addTodo),
    /* and so on */
  )
  .default(() => []);
```

```javascript
/** application.js **/
import { createStore } from 'redux';
import { combineReducers } from 'redux-fluent';
import * as actions from './todos.actions.js';
import { todos } from './todos.reducer.js';

const rootReducer = combineReducers(todos, ...);
const store = createStore(rootReducer);
console.log(store.getState()); // { todos: [] }

store.dispatch(actions.addTodo({ title: 'Walk Gipsy' }));
console.log(store.getState()); // { todos: [{ title: 'Walk Gipsy' }] }
```

## Documentation

- [`createReducer()`](#createreducer)
- [`createAction()`](#createaction)
- [`ofType()`](#oftype)
- [`withConfig()`](#withconfig)
- [`combineReducers()`](#combinereducers)
- [`createReducersMapObject()`](#createreducersmapobject)

### `createReducer()`

`createReducer` is a function combinator whose purpose is to output a [redux reducer](https://redux.js.org/basics/reducers) by combining action handlers and `getDefaultState` together.

```typescript
import { createReducer } from 'redux-fluent';

const reducer = createReducer(name)
  .actions(
    ...handlers: (state, action, config?) => state,
  )
  .default(
    getDefaultState: (state: void, action, config?) => state,
  );
```

### `createAction()`

`createAction` is a factory function whose purpose is to output an [action creator](https://redux.js.org/basics/actions#action-creators) responsible of shaping your actions. The resulting function holds a field `type` giving you access to the action type.

```typescript
import { createAction } from 'redux-fluent';

createAction(
  type: string,
  payloadCreator?: (rawPayload, rawMeta, type) => payload,
  metaCreator?: (rawPayload, rawMeta, type) => meta,
);

const addTodo = createAction('todos | add');
console.log(addTodo.type); // 'todos | add'
console.log(addTodo({ id: 1, title: 'have a break' })); // { type: 'todos | add', payload: { id: 1, title: 'have a break' } }
```

### `ofType()`

As we just said, a reducer is nothing more than a function combinator, it does not contain any business logic. The job of actually mutating the state is left to the Action Handlers. Embracing the [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle), we can build simple, easy to test, dedicated functions that do only one thing.

```typescript
import { ofType } from 'redux-fluent';

ofType(action: ReduxFluentActionCreator).map((state: any, action: AnyAction) => state);
ofType(type: string).map((state: any, action: AnyAction) => state);
ofType(action: { type: string }).map((state: any, action: AnyAction) => state);

// write your action handlers by only focusing on the actual task,
// let `ofType` take care of the orchestration (i.e. intercepting actions).
ofType('todos | add').map(
  (state, action) => state.concat(action.payload),
);
```

### `withConfig()`

Redux Fluent also comes with some additional features to help you write your code that scales. Functions that only rely on their arguments are easy to test and share, so you can provide an additional argument `config: any` (multiple `config` are shallowly merged).

```typescript
import * as R from 'ramda';
import { withConfig, createReducer, ofType } from 'redux-fluent';

withConfig(config: any);

const todos = createReducer('todos')
  .actions(
    ofType('todos | doSomething').map(
      (state, action, { doSomething }) => doSomething(state, action),
    ),
    ofType('todos | doSomethingElse').map(
      (state, action, { doSomethingElse }) => doSomethingElse(state, action),
    ),
  )
  .default(() => []);

export default R.pipe(
  withConfig({ doSomething: R.tap(console.log) }),
  withConfig({ doSomethingElse: R.tap(console.log) }),
)(todos);
```

### `combineReducers()`

This api is not strictly needed, you can still use [`redux#combineReducers`](https://redux.js.org/api/combinereducers). With Redux Fluent, by the way, both namespace and reducer are defined in the same place so that you don't need to take care of the shape when combining them.

```typescript
import { createStore } from 'redux';
import { combineReducers } from 'redux-fluent';
import { todosReducer, notesReducer, otherReducer } from './reducers';

combineReducers(...reducers: ReduxFluentReducer[]);

const rootReducer = combineReducers(todosReducer, notesReducer, otherReducer, ...);
const store = createStore(rootReducer);
```

### `createReducersMapObject()`

This api lets you combine your reducers with [`redux#combineReducers`](https://redux.js.org/api/combinereducers), and can be useful when mixing redux fluent reducers with any other reducer. 

```typescript
import { createStore, combineReducers } from 'redux';
import { createReducersMapObject } from 'redux-fluent';
import { todosReducer, notesReducer, otherReducer } from './reducers';

createReducersMapObject(...reducers: ReduxFluentReducer[]);

const reducersMapObject = createReducersMapObject(todosReducer, notesReducer, otherReducer, ...);
const rootReducer = combineReducers({
  ...reducersMapObject,
  anyOtherReducer: (state, action) => 'any other state',
});
const store = createStore(rootReducer);
```

# <a href='https://github.com/hitmands/redux-fluent'><img src='https://raw.githubusercontent.com/hitmands/redux-fluent/master/redux-fluent-logo.png' height='60' alt='Redux Fluent' aria-label='https://github.com/hitmands/redux-fluent' /></a> redux-fluent
[![Build Status](https://travis-ci.org/hitmands/redux-fluent.svg?branch=master)](https://travis-ci.org/hitmands/redux-fluent)
[![npm version](https://img.shields.io/npm/v/redux-fluent.svg)](https://www.npmjs.com/package/redux-fluent)
[![License](https://img.shields.io/npm/l/redux-fluent.svg)](https://github.com/hitmands/redux-fluent/blob/master/LICENSE)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![npm downloads](https://img.shields.io/npm/dm/redux-fluent.svg)](https://www.npmjs.com/package/redux-fluent)
[![Maintainability](https://api.codeclimate.com/v1/badges/474e33d67c5fa25495ec/maintainability)](https://codeclimate.com/github/hitmands/redux-fluent/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/474e33d67c5fa25495ec/test_coverage)](https://codeclimate.com/github/hitmands/redux-fluent/test_coverage)


Tiny and eloquent way to manage a redux-like state manager (*~3K*, dependencies free, definitions included).

[Try it out on RunKit](https://runkit.com/hitmands/redux-fluent-playground)


## Documentation


## Motivation

**[Redux](https://redux.js.org/)** is great, every recent web application has most likely been built on top of it. **How can we make it even better?**

 - **λ Go Functional**, Everything is a function and reducers are built by function composition rather than piling up if and switch-case statements: *Let's introduce Redux Fluent Reducers*.
 - **Reducers at scale**, due to being handling multiple actions, reducers tend to grow and become difficult to maintain: *Let's introduce Redux Fluent Action Handlers*.
 - **Less boilerplate**, Flux architecture is usually verbose and some of their concepts, such as `Action`, `Action Type` and `Action Creator` could all be implemented in a single entity: *Let's introduce Redux Fluent Actions*.
 - **FSA compliance**, FSA Actions may have a `error: boolean` field, which indicates whether the action represents a failure or not. Respecting this pattern leads to a series of if statements inside reducers, compromising both readability and maintainability, so the community normally tends to split error and failures into two separate actions (eg: `ADD_TODO_SUCCESS` and `ADD_TODO_ERROR`) which reduces cognitive complexity on one hand but produces even more boilerplate on the other. *Let's embrace FSA and abstract error handling with filterable action handlers*.

## Installation

```bash
yarn add redux-fluent
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
store.getState(); // { todos: [] }

store.dispatch(actions.addTodo({ title: 'Walk Gipsy' }));
store.getState(); // { todos: [{ title: 'Walk Gipsy' }] }
```

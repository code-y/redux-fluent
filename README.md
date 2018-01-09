# <a href='https://github.com/Code-Y/redux-fluent'><img src='https://raw.githubusercontent.com/Code-Y/redux-fluent/master/redux-fluent-logo.png' height='60' alt='Redux Fluent Logo' aria-label='https://github.com/Code-Y/redux-fluent' /></a> Redux Fluent
[![npm version](https://img.shields.io/npm/v/redux-fluent.svg)](https://www.npmjs.com/package/redux-fluent)
[![Build Status](https://travis-ci.org/Code-Y/redux-fluent.svg?branch=master)](https://travis-ci.org/Code-Y/redux-fluent)
[![npm downloads](https://img.shields.io/npm/dm/redux-fluent.svg)](https://www.npmjs.com/package/redux-fluent)
[![Code Climate](https://codeclimate.com/github/Code-Y/redux-fluent/badges/gpa.svg)](https://codeclimate.com/github/Code-Y/redux-fluent)
[![Test Coverage](https://api.codeclimate.com/v1/badges/02e8b0d9ba383c19ae50/test_coverage)](https://codeclimate.com/github/Code-Y/redux-fluent/test_coverage)
[![npm version](https://img.shields.io/npm/l/redux-fluent.svg)](https://github.com/Code-Y/redux-fluent/blob/master/LICENSE) 
 

Tiny and eloquent way to manage a redux-like state manager (*3K*, dependencies free, definitions included).


## Motivation

[Redux](https://redux.js.org/) is great, *every recent web application was most likely been built on top of it*, however we really think we can simplify it further and after our investigation we came out with:

 - **Reducers** usually tend to grow and become hard to maintain, 'cause of the amount of switch-cases.
 - Concepts such as **Action**, **Action Type** and **Action Creator** could be squashed into only one.
 - The push towards the standards should be stronger.

## Installation

To install the stable version:

```bash
npm install --save redux-fluent
```

## Usage

```javascript
/** todosReducer.js **/
import { createAction, createReducer } from 'redux-fluent';


const addTodo = createAction('@@todos | add');
const addTodoTask = (state, { payload }) => ({ 
  ...state, 
  list: state.list.concat(payload),
});

const todosReducer = createReducer('@@todos')
  .case(addTodo)
  .do(addTodoTask)
  
  .default()
;

export { todosReducer, addTodo };
```

```javascript
/** application.js **/
import { createStore, combineReducers } from 'redux';
import { todosReducer, addTodo } from './todosReducer';


const reducers = combineReducers({
  [todosReducer]: todosReducer,
});

const store = createStore(reducers);

// You can think of `addTodo` as an action creator itself
store.dispatch(
  addTodo({
    id: 1,
    title: 'Walk Gipsy',
  }),
);
```

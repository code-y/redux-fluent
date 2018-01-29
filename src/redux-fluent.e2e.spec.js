import { isError, isFSA } from 'flux-standard-action';
import { combineReducers, createStore } from 'redux';
import { createAction, createReducer, createCombinableReducers } from './redux-fluent';

describe('E2E', () => {
  let reducer;
  let reducers;

  const addTodoReducer = (state, action) => state.concat(action.payload);
  const removeTodoReducer = (state, action, { identity }) => (
    identity(state.filter(todo => todo.id !== action.payload.id))
  );

  const addTodo = createAction('@@todos | new');
  const removeTodo = createAction('@@todos/:id | remove');
  const error = jasmine.createSpy('success').and.callFake(state => state);
  const success = jasmine.createSpy('error').and.callFake(state => state);

  beforeEach(() => {
    reducer = createReducer('@@todos')
      .config({ identity: arg => arg })

      .case(addTodo)
      .do(addTodoReducer)
      .then(success)
      .catch(error)

      .case(removeTodo)
      .then(removeTodoReducer)

      .default(() => []);

    reducers = createCombinableReducers(reducer);
  });

  it('[redux] should add a new todo', () => {
    const store = createStore(combineReducers(reducers));

    const todo = { title: 'Walk Gipsy', id: Math.random().toString(32).slice(2) };
    const getTodos = () => store.getState()[reducer.domain];

    expect(getTodos()).toHaveLength(0);

    store.dispatch(addTodo(todo));
    expect(getTodos()).toHaveLength(1);
    expect(getTodos()[0]).toHaveProperty('title', todo.title);

    store.dispatch(removeTodo(todo));
    expect(getTodos()).toHaveLength(0);

    expect(success).toHaveBeenCalled();
    expect(error).not.toHaveBeenCalled();
  });

  it('[flux standard action] compliance', () => {
    expect(isFSA(addTodo({ title: 'Walk Gipsy' }))).toBe(true);
    expect(isError(addTodo({ title: 'Walk Gipsy' }))).toBe(false);

    expect(isFSA(addTodo({}, { date: new Date() }))).toBe(true);
    expect(isError(addTodo({}, { date: new Date() }))).toBe(false);

    expect(isFSA(removeTodo(new Error('unable to remove todo')))).toBe(true);
    expect(isError(removeTodo(new Error('unable to remove todo')))).toBe(true);

    expect(isFSA(removeTodo(new Error(), { reason: 'some real reason' }))).toBe(true);
    expect(isError(removeTodo(new Error(), { reason: 'some real reason' }))).toBe(true);
  });

  it.skip('[@ngrx/store] should add a new todo');
});

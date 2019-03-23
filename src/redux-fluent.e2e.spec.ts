import { createStore } from 'redux';
import { isError } from 'flux-standard-action';
import {
  createAction,
  combineReducers,
  createReducer, ofType,
} from './redux-fluent';


describe('redux-fluent E2E', () => {
  interface Todo {
    id: string;
    completed: boolean;
  }

  const actions = {
    addTodo: createAction<'todos | add', Todo>('todos | add'),
    deleteTodo: createAction<'todos/:id | delete', Todo>('todos/:id | delete'),
  };

  const todos = createReducer<'todos', Todo[]>('todos')
    .actions(
      ofType(actions.addTodo).map(
        ((state, action) => state.concat(action.payload)),
      ),
      ofType(actions.deleteTodo).map(
        ((state, action) => (isError(action)
          ? state
          : state.filter(({ id }) => id !== action.payload.id))),
      ),
    )
    .default(() => []);

  const rootReducer = combineReducers(todos);

  it('should add a todo', () => {
    const store = createStore(rootReducer);
    const todo = {
      id: 'first-todo-id',
      status: 'pending',
    };

    store.dispatch(actions.addTodo(todo));
    expect(
      store.getState(),
    ).toMatchSnapshot();
  });

  it('should delete a todo', () => {
    const store = createStore(rootReducer);
    const todo = {
      id: 'first-todo-id',
      status: 'pending',
    };

    store.dispatch(actions.addTodo(todo));
    expect(
      store.getState(),
    ).toMatchSnapshot();

    store.dispatch(actions.deleteTodo(new Error('something went wrong')));
    expect(
      store.getState(),
    ).toMatchSnapshot();

    store.dispatch(actions.deleteTodo(todo));
    expect(
      store.getState(),
    ).toMatchSnapshot();
  });
});

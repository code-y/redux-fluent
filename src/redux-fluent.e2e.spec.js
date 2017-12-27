import { createAction, createReducer } from './redux-fluent';


function getDefaultState() {
  return { list: [] };
}

function addTodoReducer(state, action) {
  return {
    ...state,
    list: state.list.concat(action.payload),
  };
}

function removeTodoReducer(state, action) {
  return {
    ...state,
    list: state.list.filter(todo => todo.id !== action.payload.id),
  };
}

it('should add a new todo', () => {
  const addTodo = createAction('@@todos:add');
  const removeTodo = createAction('@@todos:remove');
  const reducer = createReducer('@@todos')

    .case(addTodo)
    .do(addTodoReducer)

    .case(removeTodo)
    .do(removeTodoReducer)

    .default(getDefaultState);

  const todo = { title: 'Walk Gipsy', id: Math.random().toString(32).slice(2) };

  let state = reducer();
  expect(state.list).toHaveLength(0);

  state = reducer(state, addTodo(todo));
  expect(state.list).toHaveLength(1);
  expect(state.list[0]).toHaveProperty('title', todo.title);

  state = reducer(state, removeTodo(todo));
  expect(state.list).toHaveLength(0);
});

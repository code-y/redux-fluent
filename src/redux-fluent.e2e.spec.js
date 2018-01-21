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

function removeTodoReducer(state, action, { identity }) {
  return identity({
    ...state,
    list: state.list.filter(todo => todo.id !== action.payload.id),
  });
}

it('should add a new todo', () => {
  const addTodo = createAction('@@todos | add');
  const removeTodo = createAction('@@todos | remove');
  const success = jasmine.createSpy('success').and.callFake(state => state);
  const error = jasmine.createSpy('error').and.callFake(state => state);

  const reducer = createReducer('@@todos')
    .config({ identity: arg => arg })

    .case(addTodo)
    .do(addTodoReducer)
    .then(success)
    .catch(error)

    .case(removeTodo)
    .then(removeTodoReducer)

    .default(getDefaultState);

  const todo = { title: 'Walk Gipsy', id: Math.random().toString(32).slice(2) };

  let state = reducer();
  expect(state.list).toHaveLength(0);

  state = reducer(state, addTodo(todo));
  expect(state.list).toHaveLength(1);
  expect(state.list[0]).toHaveProperty('title', todo.title);

  state = reducer(state, removeTodo(todo));
  expect(state.list).toHaveLength(0);

  expect(success).toHaveBeenCalled();
  expect(error).not.toHaveBeenCalled();
});

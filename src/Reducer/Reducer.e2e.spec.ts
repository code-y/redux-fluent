import { createAction, createReducer } from '../redux-fluent';
import { Action } from '../Types/Types';


interface Todo {
  title: string;
  id: string;
}

interface TodosState {
  list: Todo[];
}

function getDefaultState(): TodosState {
  return {list: []};
}

function addTodoReducer(state: TodosState, action: Action<Todo>): TodosState {

  // @ts-ignore
  return Object.assign({}, state, {
    list: state.list.concat(action.payload),
  });
}

function editTodoReducer(state: TodosState, action: Action<Todo>): TodosState {

  // @ts-ignore
  return Object.assign({}, state, {
    // @ts-ignore
    list: state.list.map(todo => action.payload.id !== todo.id ? todo : action.payload),
  });
}

it('should add a new todo', () => {
  const addTodo = createAction<Todo>('@@todos:add');
  const editTodo = createAction<Todo>('@@todos:edit');
  const reducer = createReducer<TodosState>('@@todos')

    .case(addTodo)
    .do(addTodoReducer)

    .case(editTodo)
    .do(editTodoReducer)

    .default(getDefaultState)
  ;

  const todo = {
    title: 'Walk Gipsy',
    id: Math.random().toString(2),
  };

  let state: TodosState = reducer();
  expect(state.list).toHaveLength(0);

  state = reducer(state, addTodo(todo));
  expect(state.list).toHaveLength(1);
  expect(state.list[0]).toHaveProperty('title', todo.title);

  const editedTodo = {
    title: 'Walk Gipsy to the park',
    id: todo.id,
  };

  state = reducer(state, editTodo(editedTodo));
  expect(state.list).toHaveLength(1);
  expect(state.list[0]).toHaveProperty('title', editedTodo.title);
});

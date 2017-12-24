import { createAction, createReducer } from '../redux-fluent';
import { Action } from '../Types/Types';


interface Todo {
  title: string;
  body?: string;
}

interface Todo {
  title: string;
}

interface TodosState {
  list: Todo[];
}

function getDefaultState(): TodosState {
  return { list: [] };
}

function addTodoReducer(state: TodosState, action: Action<Todo>): TodosState {

  // @ts-ignore
  return Object.assign({}, state, {
    list: state.list.concat(action.payload),
  });
}

it('should add a new todo', () => {
  const addTodo = createAction<Todo>('@@todos:add');
  const reducer = createReducer<TodosState>('@@todos')

    .case(addTodo)
    .do(addTodoReducer)

    .default(getDefaultState)
  ;

  const todo = { title: 'Walk Gipsy' };

  let state: TodosState = reducer();
  expect(state.list).toHaveLength(0);

  state = reducer(state, addTodo(todo));
  expect(state.list).toHaveLength(1);
  expect(state.list[0]).toHaveProperty('title', todo.title);
});

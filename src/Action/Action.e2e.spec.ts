import { createAction } from '../redux-fluent';
import {ACTION_TYPE, GenericMeta, GenericPayload} from '../Types/Types';

describe('createAction', () => {
  it('todos / add', () => {
    const type: ACTION_TYPE = '@@test/todos:add';
    const addTodo = createAction(type);
    const exampleTodo = {
      title: 'Early Morning',
      body: 'Walk Gipsy',
    };

    const action = addTodo(exampleTodo);

    expect(action).toHaveProperty('payload', exampleTodo);
    expect(action).toHaveProperty('meta', null);
    expect(action).toHaveProperty('error', false);
    expect(action).toHaveProperty('type', type);
  });

  it('todos / add / error', () => {
    const type: ACTION_TYPE = '@@test/todos:add';
    const addTodo = createAction(type);
    const error = new Error('impossible to add todo');

    const action = addTodo(error);

    expect(action).toHaveProperty('payload', error);
    expect(action).toHaveProperty('meta', null);
    expect(action).toHaveProperty('error', true);
    expect(action).toHaveProperty('type', type);
  });
});

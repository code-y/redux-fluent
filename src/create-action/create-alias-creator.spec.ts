import { expect } from 'chai';
import { createAction } from './create-action';

describe('Action', () => {
  it('should export a function { alias }', () => {
    expect(createAction('foo'))
      .to.have.property('alias')
      .which.is.a('function');
  });

  it('should alias the given action', () => {
    const addTodo = createAction('Todo');
    const addTodoAlias = addTodo.alias();

    const a = addTodo('hello');
    const b = addTodoAlias('hello');

    expect(a).to.deep.equal(b);

    const a1 = addTodo('hello', 'world');
    const b1 = addTodoAlias('hello', 'world');

    expect(a1).to.deep.equal(b1);
  });

  it('should alias the given action with a different payload creator', () => {
    const addTodo = createAction('Todo', () => 'Hello');
    const addTodoAlias = addTodo.alias(() => 'World');

    const a = addTodo('hello');
    const b = addTodoAlias('hello');

    expect(a)
      .to.have.property('payload')
      .which.is.equal('Hello');

    expect(b)
      .to.have.property('payload')
      .which.is.equal('World');
  });

  it('should alias the given action with a different meta creator', () => {
    const addTodo = createAction('Todo', () => null, () => 'Hello');
    const addTodoAlias = addTodo.alias(() => null, () => 'World');

    const a = addTodo('hello');
    const b = addTodoAlias('hello');

    expect(a)
      .to.have.property('meta')
      .which.is.equal('Hello');

    expect(b)
      .to.have.property('meta')
      .which.is.equal('World');
  });
});

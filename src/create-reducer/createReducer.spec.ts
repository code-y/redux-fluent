import sinon from 'sinon';
import { expect } from 'chai';
import { createReducer } from './createReducer';


describe('Reducer', () => {
  it('should export a function { createReducer }', () => {
    expect(createReducer)
      .to.be.a('function');
  });

  it('should have a name', () => {
    const name = 'foo';
    const reducer = createReducer(name).actions().default();

    expect(reducer)
      .to.have.property('name', `reducer('${name}')`);
  });

  it('should have a type', () => {
    const name = 'bar';
    const reducer = createReducer(name).actions().default();

    expect(reducer)
      .to.have.property('type', name);
  });

  describe('{ actions }', () => {
    it('should set $$context.handlers', () => {
      const fn1 = (arg: any) => arg;
      const fn2 = (arg: any) => arg;

      const reducer = createReducer('baz').actions(fn1, fn2).default();

      expect(reducer)
        .to.have.deep.nested.property('$$context.handlers', [fn1, fn2]);
    });

    it('should return "hello world"', () => {
      const hello = sinon.spy(() => 'hello');
      const world = sinon.spy((state: string) => `${state} world`);

      const reducer = createReducer('baz').actions(hello, world).default();
      const state = reducer(null, { type: 'greetings' });

      expect(state)
        .to.equal('hello world');

      expect(hello)
        .to.have.been.calledOnce;
      expect(world)
        .to.have.been.calledOnce;

      expect(hello)
        .to.have.been.calledImmediatelyBefore(world);
      expect(world)
        .to.have.been.calledImmediatelyAfter(hello);
    });
  });

  describe('{ default }', () => {
    it('should set $$context.getDefaultState', () => {
      const getDefaultState = () => 'hello world';
      const reducer = createReducer('foo bar').actions().default(getDefaultState);

      expect(reducer)
        .to.have.deep.nested.property('$$context.getDefaultState', getDefaultState);
    });

    it('should call getDefaultState when state is undefined', () => {
      const getDefaultState = sinon.spy(() => 'default state');
      const reducer = createReducer('foo bar baz').actions().default(getDefaultState);

      const state2 = reducer(undefined, { type: '@@init' });
      expect(state2)
        .to.equal('default state');

      expect(getDefaultState)
        .to.have.been.calledOnce;
    });

    it('should not call getDefaultState when state is not nil', () => {
      const getDefaultState = sinon.spy(() => 'default state');
      const reducer = createReducer('bar baz foo').actions().default(getDefaultState);

      const state = reducer('not nil', { type: '@@init' });
      expect(state)
        .to.equal('not nil');

      expect(getDefaultState)
        .not.to.have.been.called;
    });
  });
});

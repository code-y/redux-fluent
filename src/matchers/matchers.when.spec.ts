import { spy } from 'sinon';
import { expect } from 'chai';
import { ofType } from '../of-type/ofType';
import { when } from './matchers';
import { createReducer } from '../create-reducer/create-reducer';


describe('when', () => {
  it('should export a function { matchers }', () => {
    expect(when)
      .to.be.a('function');
  });

  it('should return a function { map }', () => {
    expect(when(() => true))
      .to.have.property('map')
      .which.is.a('function');
  });

  it('should match if predicate is satisfied', () => {
    const handler = spy();
    const predicate = spy(() => true);

    const reducer = createReducer<string, null>('foo')
      .actions(
        when(predicate).map(handler),
      )
      .default(() => null);

    const action = { type: 'hello world' };
    reducer(undefined, action);

    expect(predicate).to.have.been.calledOnceWithExactly(action);
    expect(handler).to.have.been.calledOnceWithExactly(null, action, undefined);
  });

  it('should not match if predicate is not satisfied', () => {
    const handler = spy();
    const predicate = spy(() => false);

    const reducer = createReducer<string, null>('foo')
      .actions(
        when(predicate).map(handler),
      )
      .default(() => null);

    const action = { type: 'hello world' };
    reducer(undefined, action);

    expect(predicate).to.have.been.calledOnceWithExactly(action);
    expect(handler).to.not.have.been.called;
  });

  it('should map if action is matched', () => {
    const handler = spy();
    const action = { type: 'bar' };

    const reducer = createReducer<string, null>('foo')
      .actions(
        when(ofType(action)).map(handler),
      )
      .default(() => null);

    reducer(undefined, action);

    expect(handler).to.have.been.calledOnceWithExactly(null, action, undefined);
  });

  it('should not map if action is not matched', () => {
    const handler = spy();
    const action = { type: 'bar' };

    const reducer = createReducer<string, null>('foo')
      .actions(
        when(ofType(action)).map(handler),
      )
      .default(() => null);

    reducer(undefined, { type: 'not bar' });

    expect(handler).to.not.have.been.called;
  });
});

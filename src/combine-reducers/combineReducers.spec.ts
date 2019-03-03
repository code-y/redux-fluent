import sinon from 'sinon';
import { expect } from 'chai';
import * as redux from 'redux';
import { createReducer } from '../create-reducer/createReducer';
import { combineReduxFluentReducers } from './combineReducers';


describe('combineReducers', () => {
  let reduxCombineReducers: any;

  beforeEach(() => {
    reduxCombineReducers = sinon.spy(redux, 'combineReducers');
  });

  afterEach(() => {
    reduxCombineReducers.restore();
  });

  it('should export a function { combineReducers }', () => {
    expect(combineReduxFluentReducers)
      .to.be.a('function');
  });

  it('should call redux#combineReducers with { [reducer.type]: reducer }', () => {
    const foo = createReducer('foo').actions().default();
    const baz = createReducer('baz').actions().default();
    const bar = createReducer('bar').actions().default();

    combineReduxFluentReducers(foo, baz, bar);

    expect(reduxCombineReducers)
      .to.have.been.calledWithExactly({ foo, baz, bar });
  });
});

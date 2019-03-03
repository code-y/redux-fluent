import { expect } from 'chai';
import sinon from 'sinon';
import { ofType } from './ofType';
import { createAction } from '../create-action/createAction';
import { createReducer } from '../create-reducer/createReducer';


describe('ofType', () => {
  it('should export a function { ofType }', () => {
    expect(ofType)
      .to.be.a('function');
  });

  it('should return a function { map }', () => {
    expect(ofType('foo'))
      .to.have.property('map')
      .which.is.a('function');
  });

  it('should match', () => {
    const spy = sinon.spy();

    const state = 'hello';
    const action = createAction('match');
    const config: void = undefined;
    const reducer = createReducer('should match')
      .actions(
        ofType('match').map(spy),
      )
      .default();

    reducer(state, action);

    expect(spy)
      .to.have.been.calledWithExactly(state, action, config);
  });

  it('should not match', () => {
    const spy = sinon.spy();

    const state = 'hello';
    const action = createAction('match');
    const config: void = undefined;
    const reducer = createReducer('should match')
      .actions(
        ofType('not match').map(spy),
      )
      .default();

    reducer(state, action);

    expect(spy)
      .not.to.have.been.calledWithExactly(state, action, config);
  });
});

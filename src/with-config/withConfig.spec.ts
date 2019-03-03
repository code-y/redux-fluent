import { expect } from 'chai';
import sinon from 'sinon';
import R from 'ramda';
import { createReducer } from '../create-reducer/createReducer';
import { withConfig } from './withConfig';
import { createAction } from '../create-action/createAction';
import { ofType } from '../of-type/ofType';


describe('ofType', () => {
  it('should export a function { withConfig }', () => {
    expect(withConfig)
      .to.be.a('function');
  });

  it('should have a { name }', () => {
    const config = { log() {} };

    const reducer = createReducer('foobar foobaz').actions().default();
    const { name } = reducer;

    expect(withConfig(config)(reducer))
      .to.have.property('name', `withConfig(${name})`);
  });

  it('should enhance a reducer with config', () => {
    const spy = sinon.spy();
    const state = 'hello';
    const action = createAction('match');
    const config = { hello: 'world' };

    const reducer = createReducer('should match')
      .actions(
        ofType(action).map(spy),
      ).default();

    const enhanced = withConfig(config)(reducer);

    enhanced(state, action);

    expect(spy)
      .to.have.been.calledOnceWithExactly(state, action, config);
  });

  it('should add config multiple times', () => {
    const state = 'hello';
    const spy1 = sinon.spy(() => state);
    const action = createAction('match');

    const reducer = createReducer('should match').actions(
      ofType(action).map(spy1),
    ).default();
    const { name } = reducer;

    const enhanced = R.compose(
      withConfig({ c: 'c' }),
      withConfig({ b: 'b' }),
      withConfig({ a: 'a' }),
    )(reducer);

    expect(enhanced)
      .to.have.property('name', `withConfig(withConfig(withConfig(${name})))`);

    enhanced(state, action);

    expect(spy1)
      .to.have.been.calledOnceWithExactly(state, action, { a: 'a', b: 'b', c: 'c' });
  });

  it('should not mutate the given reducer', () => {
    const spy = sinon.spy();
    const state = 'hello';
    const action = createAction('match');
    const config = { hello: 'world' };

    const reducer = createReducer('should match')
      .actions(
        ofType(action).map(spy),
      ).default();

    const enhanced = withConfig(config)(reducer);

    reducer(state, action);

    expect(spy)
      .to.have.been.calledWithExactly(state, action, undefined);

    enhanced(state, action);

    expect(spy)
      .to.have.been.calledWithExactly(state, action, config);

    expect(enhanced)
      .to.not.equal(reducer);
  });
});

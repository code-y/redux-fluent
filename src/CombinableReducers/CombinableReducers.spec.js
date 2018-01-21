import {
  createCombinableReducers,
  createReducer,
} from '../redux-fluent';

describe('createCombinableReducers', () => {
  it('should return Object<domain, reducer>', () => {
    const foo = createReducer('foo').default();
    const baz = createReducer('baz').default();
    const bar = createReducer('bar').default();
    const foobar = createReducer('foobar').default();

    expect(createCombinableReducers(foo, baz, bar, foobar))
      .toEqual({
        foo, baz, bar, foobar,
      });
  });

  it('should throw if doubled reducers', () => {
    const foo = createReducer('foo').default();

    expect(() => createCombinableReducers(foo, foo))
      .toThrow(TypeError);
  });
});

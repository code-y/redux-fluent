import createCombinableReducers from './CombinableReducers';
import createReducer from '../Reducer/Reducer';


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

  it('should throw if a reducer already exists [!PRODUCTION ONLY]', () => {
    const isProd = process.env.NODE_ENV === 'production';

    const foo = createReducer('foo').default();

    if (isProd) {
      expect(() => createCombinableReducers(foo, foo))
        .not.toThrow(TypeError);
    } else {
      expect(() => createCombinableReducers(foo, foo))
        .toThrow(TypeError);
    }
  });
});

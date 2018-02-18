import createCombinableReducers from './CombinableReducers';
import createReducer from '../Reducer/Reducer';


describe('createCombinableReducers', () => {
  it('should return Object<domain, reducer>', () => {
    const foo = createReducer('foo1').default();
    const baz = createReducer('baz2').default();
    const bar = createReducer('bar3').default();
    const foobar = createReducer('foobar4').default();

    expect(createCombinableReducers(foo, baz, bar, foobar))
      .toEqual({
        foo1: foo,
        baz2: baz,
        bar3: bar,
        foobar4: foobar,
      });
  });

  it('should throw if a reducer already exists [!PRODUCTION ONLY]', () => {
    const isProd = process.env.NODE_ENV === 'production';

    const foo = createReducer('foo1.1').default();

    if (isProd) {
      expect(() => createCombinableReducers(foo, foo))
        .not.toThrow(TypeError);
    } else {
      expect(() => createCombinableReducers(foo, foo))
        .toThrow(TypeError);
    }
  });
});

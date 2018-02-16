import createFakeStore from './TestingUtilities';
import createReducer from '../Reducer/Reducer';

describe('TestingUtilities', () => {
  it('createFakeStore should return { dispatch, getState }', () => {
    const store = createFakeStore();

    expect(store).toHaveProperty('dispatch');
    expect(store).toHaveProperty('getState');
  });

  it('createFakeStore should accept [0..n] reducers', () => {
    const TEST = 'Action Test';
    const TEST2 = 'Action Test 2';

    const handler = jasmine
      .createSpy('test handler').and.returnValue('Gipsy');

    const r1 = createReducer('foo')
      .case(TEST)
      .do(handler)
      .default();

    const r2 = createReducer('foobar')
      .case(TEST2)
      .do(handler)
      .default();

    const store = createFakeStore(r1, r2);

    store.dispatch({ type: TEST });
    expect(handler).toHaveBeenCalled();
    store.dispatch({ type: TEST2 });
    expect(handler).toHaveBeenCalled();

    expect(store.getState())
      .toEqual({ foo: 'Gipsy', foobar: 'Gipsy' });
  });

  it('{ dispatch() } should allow chaining', () => {
    const s = createFakeStore();
    const s1 = s.dispatch({ type: 'Hello World 1' });
    const s2 = s1.dispatch({ type: 'Hello World 2' });
    const s3 = s2.dispatch({ type: 'Hello World 3' });


    expect(s3).toHaveProperty('dispatch');
    expect(s3.getState()).toEqual({});
  });

  it('{ getState() } should return {}', () => {
    const store = createFakeStore();

    expect(store.getState()).toEqual({});
  });
});

import { createReducer } from '../redux-fluent';


describe('createReducer', () => {

  it('createReducer() should return: { configs, case, default }', () => {
    expect(createReducer('foo'))
      .toHaveProperty('config', jasmine.any(Function));

    expect(createReducer('foo'))
      .toHaveProperty('case', jasmine.any(Function));

    expect(createReducer('foo'))
      .toHaveProperty('default', jasmine.any(Function));
  });

  it('createReducer.default() should return a function', () => {

    expect(createReducer('foo').default({}))
      .toEqual(jasmine.any(Function));
  });

  it('createReducer.default() should return a function with a property domain', () => {
    const domain = 'baz';

    expect(createReducer(domain).default({}))
      .toHaveProperty('domain', domain);
  });

  it('createReducer.config() should return { case, default }', () => {
    expect(createReducer('foo').config({}))
      .toHaveProperty('case', jasmine.any(Function));

    expect(createReducer('foo').config({}))
      .toHaveProperty('default', jasmine.any(Function));
  });

  it('createReducer.case() should recursively return { case, do }', () => {

    const addCases = (obj, times) => (
      // tslint:disable-next-line
      --times ? addCases(obj.case({}), times) : obj
    );

    const addDos = (obj, times) => (
      // tslint:disable-next-line
      --times ? addDos(obj.do({}), times) : obj
    );


    expect(
      addCases(createReducer('foo').case({}), 7),
    ).toHaveProperty('case', jasmine.any(Function));

    expect(
      addCases(createReducer('foo').case({}), 32),
    ).toHaveProperty('do', jasmine.any(Function));

    expect(
      addDos(createReducer('foo').case({}), 7),
    ).toHaveProperty('case', jasmine.any(Function));

    expect(
      addDos(createReducer('foo').case({}), 32),
    ).toHaveProperty('do', jasmine.any(Function));

  });
});

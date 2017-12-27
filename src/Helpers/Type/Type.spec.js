import Type from './Type';

describe('Type', () => {
  it('checker should have a property {() => string} "toString"', () => {
    expect('toString' in Type.checker).toEqual(true);
    expect(Type.checker.toString()).toEqual(jasmine.any(String));
  });

  it('method of should return [object Type]', () => {
    expect(Type.of(() => {})).toEqual('[object Function]');
  });

  it('method isFunction should return boolean', () => {
    expect(Type.isFunction(() => {})).toBeTruthy();
    expect(Type.isFunction({})).not.toBeTruthy();
    expect(Type.isFunction()).not.toBeTruthy();
    expect(Type.isFunction(null)).not.toBeTruthy();
  });
});

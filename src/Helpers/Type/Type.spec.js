import { isFunction } from './Type';

describe('Helpers/isFunction', () => {
  it('method isFunction should return boolean', () => {
    expect(isFunction(() => {})).toBeTruthy();
    expect(isFunction({})).not.toBeTruthy();
    expect(isFunction()).not.toBeTruthy();
    expect(isFunction(null)).not.toBeTruthy();
  });
});

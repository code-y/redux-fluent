export default class Type {
  static checker = {};

  static of(value) {
    return Type.checker.toString.call(value);
  }

  static is(value, expected) {
    return Type.of(value) === expected;
  }

  static isFunction(value) {
    return Type.is(value, '[object Function]');
  }
}

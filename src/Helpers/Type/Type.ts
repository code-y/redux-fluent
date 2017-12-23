export default class Type {
  static of(value: any) {
    return ({}).toString.call(value);
  }

  static is(value: any, expected: any) {
    return Type.of(value) === expected;
  }

  static isString(value: any) {
    return Type.is(value, '[object String]');
  }

  static isFunction(value: any) {
    return Type.is(value, '[object Function]');
  }

  static isObject(value: any) {
    return Type.is(value, '[object Object]');
  }
}

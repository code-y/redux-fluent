export default class Type {
  static of(value: any): string {
    return ({}).toString.call(value);
  }

  static is(value: any, expected: string): boolean {
    return Type.of(value) === expected;
  }

  static isFunction(value: any): value is () => {} {
    return Type.is(value, '[object Function]');
  }
}

const getType = (checker => arg => checker.toString.call(arg))({});
// eslint-disable-next-line import/prefer-default-export
export const isFunction = value => getType(value) === '[object Function]';

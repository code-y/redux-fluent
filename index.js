// eslint-disable-next-line import/no-dynamic-require
module.exports = require(
  './dist/redux-fluent.'
    .concat(process.env.NODE_ENV === 'production' ? 'production' : 'development')
    .concat('.js'),
);

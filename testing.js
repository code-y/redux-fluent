/* eslint-disable spaced-comment, strict, global-require */

'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/redux-fluent.testing.production.js');
} else {
  module.exports = require('./build/redux-fluent.testing.development.js');
}

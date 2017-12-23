'use strict';

if (process.env.NODE_ENV === 'production') {
  module.exports = require('./build/redux-fluent.production.js');
} else {
  module.exports = require('./build/redux-fluent.development.js');
}

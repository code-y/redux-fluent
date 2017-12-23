const path = require('path');
const webpack = require('webpack');

const ROOT = __dirname;

module.exports = env => {
  const configs = {
    devtool: 'source-map',
    target: 'web',
    context: path.join(ROOT, 'src'),
    output: {
      path: path.join(ROOT, 'build'),
      filename: 'redux-fluent.js',
    },
    entry: [ './redux-fluent.ts' ],
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.tsx?$/,
          loader: 'tslint-loader',
          exclude: /node_modules/,
          options: {
            failOnHint: true,
            configuration: require('./tslint.json')
          },
        },
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        }
      ]
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ]
    },
    plugins: []
  };


  if(process.env.NODE_ENV === 'production') {
    configs.plugins.push(
      new webpack.optimize.UglifyJsPlugin({ sourceMap: true })
    );
  }

  return Promise.resolve(configs);
};

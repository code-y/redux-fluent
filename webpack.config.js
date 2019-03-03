/* eslint-disable strict */

'use strict';

const path = require('path');
const webpack = require('webpack');
const pkg = require('./package');


const ROOT = __dirname;
const BUILD_DATE = new Date();
const banner = env => `/**!
  * @build-info ${env} - ${BUILD_DATE}

  * @name ${pkg.name}
  * @version ${pkg.version}
  * @author ${pkg.author}
  * @description ${pkg.description}
  * @contributors [
    * ${pkg.contributors.join('\n    * ')}
  * ]

  * @homepage ${pkg.homepage}
  * @keywords [ ${pkg.keywords.join(', ')} ]
  * @license ${pkg.license}
**/`;

const config = ({ ENV } = {}) => ({
  mode: ENV,
  target: 'web',
  devtool: 'source-map',
  context: path.join(ROOT, 'src'),
  externals: /^(redux)$/,
  entry: {
    [pkg.name]: [`./${pkg.name}.ts`],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(ROOT, 'dist'),
    filename: `[name].${ENV}.js`,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          emitWarning: ENV === 'development',
        },
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'awesome-typescript-loader',
            options: {},
          },
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: banner(ENV),
      raw: true,
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(ENV),
    }),
  ],
});

module.exports = () => {
  const tasks = [].concat(config({ ENV: 'development' }));

  if (process.env.NODE_ENV === 'production') {
    tasks.push(config({ ENV: 'production' }));
  }

  return Promise.resolve(tasks);
};

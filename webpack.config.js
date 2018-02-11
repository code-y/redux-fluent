const path = require('path');
const webpack = require('webpack');

const ROOT = __dirname;
const pkg = require('./package');

const banner = env => `/**!
  * @build-info ${env} - ${new Date()}

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

const config = ({ ENV }) => ({
  mode: ENV,
  target: 'web',
  devtool: 'source-map',
  context: path.join(ROOT, 'src'),
  entry: {
    'redux-fluent': ['./redux-fluent.js'],
    'redux-fluent.testing': ['./redux-fluent.testing.js'],
  },
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(ROOT, 'build'),
    filename: `[name].${ENV}.js`,
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.js?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/,
        options: {
          emitWarning: ENV === 'development',
        },
      },
      {
        test: /\.js?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
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
  const tasks = [config({ ENV: 'development' })];

  if (process.env.NODE_ENV === 'production') {
    const task = config({ ENV: 'production' });

    tasks.push(task);
  }

  return Promise.resolve(tasks);
};

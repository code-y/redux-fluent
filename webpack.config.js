const path = require('path');
const webpack = require('webpack');
const ROOT = __dirname;
const pkg = require('./package');

const banner = (buildDate => env => `/**!
  * @build-info ${env} - ${buildDate}

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
**/`)(new Date());

module.exports = (env = {}) => {
  const config = ({ ENV }) => ({
    target: 'web',
    devtool: 'source-map',
    context: path.join(ROOT, 'src'),
    entry: [ './redux-fluent.js' ],
    output: {
      path: path.join(ROOT, 'build'),
      filename: `redux-fluent.${ENV}.js`,
    },
    module: {
      rules: [
        {
          enforce: 'pre',
          test: /\.jsx?$/,
          loader: 'eslint-loader',
          exclude: /node_modules/,
          options: {
            emitWarning: true,
          },
        },
        {
          test: /\.jsx?$/,
          use: 'babel-loader',
          exclude: /node_modules/,
        }
      ]
    },
    resolve: {
      extensions: [ '.js' ]
    },
    plugins: [
      new webpack.BannerPlugin({
        banner: banner(ENV),
        raw: true,
      }),
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(ENV),
      }),
    ]
  });

  const tasks = [ config({ ENV: 'development' }) ];

  if(env.name === 'production') {
    const task = config({ ENV: 'production' });
    task.plugins.push(new webpack.optimize.UglifyJsPlugin({ sourceMap: true }));

    tasks.push(task);
  }

  return Promise.resolve(tasks);
};

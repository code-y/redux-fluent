const ENV_TESTING = process.env.NODE_ENV === 'testing';

const config = {
  presets: [
    ['@babel/preset-env', {
      modules: ENV_TESTING && 'commonjs',
      loose: true,
      browsers: "ie 9"
    }]
  ],
  plugins: []
};

module.exports = config;
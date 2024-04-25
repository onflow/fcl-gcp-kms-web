const path = require('path');

module.exports = {
  // Your existing configuration
  mode: 'development', // or 'production'
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    fallback: {
      stream: require.resolve('stream-browserify'),
    },
  },
  module: {
    rules: [
      // your existing rules for loaders
    ],
  },
  // Optionally, other configurations like plugins
};

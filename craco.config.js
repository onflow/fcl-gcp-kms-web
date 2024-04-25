// craco.config.js
module.exports = {
    webpack: {
      configure: (webpackConfig, { env, paths }) => {
        webpackConfig.resolve.fallback = {
          ...webpackConfig.resolve.fallback, // retain existing fallbacks
          crypto: require.resolve('crypto-browserify'),
          stream: require.resolve('stream-browserify'),
        };
        return webpackConfig;
      },
    },
  };
  
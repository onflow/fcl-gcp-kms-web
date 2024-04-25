const { whenDev } = require("@craco/craco");

module.exports = {
    babel: {
        plugins: [
            ...whenDev(() => ["react-refresh/babel"], []), // Ensures it's only included in development
        ]
    },
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            if (env === "development") {
                const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
                webpackConfig.plugins.push(new ReactRefreshWebpackPlugin());
            }
            webpackConfig.resolve.fallback = {
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
            };
            return webpackConfig;
        },
    },
};

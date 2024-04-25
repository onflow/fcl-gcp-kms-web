const { whenDev } = require("@craco/craco");

module.exports = {
    webpack: {
        configure: (webpackConfig, { env, paths }) => {
            webpackConfig.resolve.fallback = {
                ...webpackConfig.resolve.fallback,
                crypto: require.resolve('crypto-browserify'),
                stream: require.resolve('stream-browserify'),
            };
            return webpackConfig;
        },
    },
    babel: {
        plugins: [
            ...whenDev(() => [["react-refresh/babel", {}, "react-refresh-babel-plugin"]], [])
        ]
    },
    plugins: [
        ...whenDev(() => [{
            plugin: require('@pmmmwh/react-refresh-webpack-plugin'),
            options: {
                disableRefreshCheck: true,
            }
        }], [])
    ]
};

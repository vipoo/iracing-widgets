const webpack = require("webpack");

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false')),
});

module.exports = {
  dev: {
    // devtool: 'inline-source-map',
    stats: true
  },
  watchDev: {
    // devtool: 'inline-source-map',
    stats: false,
    watch:true,
    keepalive:true,
    failOnError: false
  },
  options: {
    entry: "./src/widgets/js/widgets",
    resolve: {
      modulesDirectories: [ './src', "node_modules" ]
    },
    output: {
      filename: 'widgets.js',
      path: 'public',
      publicPath: '/'
    },

    module: {
      loaders: [
        { test: /\.js?/, exclude: /node_modules/, loader: 'babel-loader'}
      ]
    },
    plugins: [
      definePlugin,
      //new webpack.optimize.UglifyJsPlugin({minimize: false})
    ]
  },
  dist: {}
}

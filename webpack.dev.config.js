/* eslint-env node */

const webpack = require('webpack');
const WebpackConfig = require('webpack-config').default;

const devPort = 3000;

module.exports = new WebpackConfig().extend('./webpack.common.config.js').merge({
  devServer: {
    hot: true,
    contentBase: './examples',
    port: devPort
  },

  entry: [
    `webpack-dev-server/client?http://localhost:${devPort}`,
    'webpack/hot/only-dev-server',
    require.resolve('./frontend'),
  ],

  devtool: 'eval-source-map',

  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
});

/* eslint-env node */

const webpack = require('webpack');
const WebpackConfig = require('webpack-config').default;
const CompressionPlugin = require('compression-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');

module.exports = new WebpackConfig().extend('./webpack.common.config.js').merge({
  devtool: 'source-map',

  entry: require.resolve('./frontend'),

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new LodashModuleReplacementPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      screwIe8: true,
      compress: {
        warnings: false
      }
    }),
    new CompressionPlugin({
      asset: '[path].gz[query]',
      algorithm: 'gzip',
      threshold: 10240
    })
  ]
});

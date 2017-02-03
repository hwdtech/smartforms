/* eslint-env node */

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'smartforms.js',
    libraryTarget: 'var',
    library: 'smartforms'
  },

  externals: {
    jquery: 'jQuery'
  },

  module: {
    rules: [{
      test: /\.js$/,
      exclude: /(node_modules)/,
      loader: 'babel-loader'
    }, {
      test: /\.jade/,
      loader: 'jade-loader'
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallbackLoader: 'style-loader',
        loader: [
          'css-loader',
          'postcss-loader'
        ]
      })
    }, {
      test: /\.png/,
      loader: 'url-loader'
    }]
  },

  plugins: [
    new ExtractTextPlugin('smartforms.css')
  ]
};

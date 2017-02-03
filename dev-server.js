/* eslint-env node */
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.dev.config');

const server = new WebpackDevServer(webpack(config), config.devServer);
server.listen(config.devServer.port);

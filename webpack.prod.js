const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ArchivePlugin = require('webpack-archive-plugin');

module.exports = merge(common, {
  //devtool: 'source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      comments: false,
      minimize: false
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ArchivePlugin({
      output: 'cattrack-client-react'
    }),
  ]
});
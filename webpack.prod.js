const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const ArchivePlugin = require('webpack-archive-plugin');

let BASENAME = "";
if (process.env.TRAVIS_BRANCH === "master") {
  BASENAME = "/c";
} else if (process.env.TRAVIS_BRANCH === "stage") {
  BASENAME = "/c/stage";
}

module.exports = merge(common, {
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
        BASENAME: JSON.stringify(BASENAME)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      compress: {warnings: false},
      comments: false,
      minimize: false,
      sourceMap: true
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
    new ArchivePlugin({
      output: 'cattrack-client-react'
    }),
  ]
});
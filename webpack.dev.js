const webpack = require('webpack');
const merge = require('webpack-merge');
const common = require('./webpack.common.js');

const BASENAME = '';

module.exports = merge(common, {
  devtool: "source-map",
  /*rules: [
    {
      test: /\.js$/,
      use: ["source-map-loader"],
      options: {
        enforce: "pre"
      }
    }
  ],*/
  devServer: {
    historyApiFallback: {
      index: BASENAME + '/index.html',
    },
    publicPath: BASENAME,
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BASENAME: JSON.stringify(BASENAME)
      }
    }),
  ]
});

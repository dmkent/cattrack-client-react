const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: "source-map",
  rules: [
    {
      test: /\.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    }
  ],
  devServer: {
    historyApiFallback: true,
  },
});

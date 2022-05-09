const webpack = require("webpack");
const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");

const BASENAME = "";

module.exports = merge(common, {
  mode: "development",
  devtool: "inline-source-map",
  devServer: {
    historyApiFallback: {
      index: BASENAME + "/index.html",
    },
  },
  optimization: {
    runtimeChunk: "single",
  },
  plugins: [
    new webpack.DefinePlugin({
      BASENAME: JSON.stringify(BASENAME),
    }),
  ],
  resolve: {
    alias: {
      ctrack_config: path.join(__dirname, "src/config/config.dev.js"),
    },
  },
});

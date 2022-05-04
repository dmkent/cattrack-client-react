const webpack = require("webpack");
const {merge} = require("webpack-merge");
const common = require("./webpack.common.js");
const TerserPlugin = require("terser-webpack-plugin");
const path = require("path");

let BASENAME = "";
if (process.env.TRAVIS_BRANCH === "master") {
  BASENAME = "/c";
} else if (process.env.TRAVIS_BRANCH === "stage") {
  BASENAME = "/c/stage";
}

module.exports = merge(common, {
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env": {
        NODE_ENV: JSON.stringify("production"),
      },
      BASENAME: JSON.stringify(BASENAME),
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  resolve: {
    alias: {
      config: path.join(__dirname, "src/config/config.prod.js"),
    },
  },
});

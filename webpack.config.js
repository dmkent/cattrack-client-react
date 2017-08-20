module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  devtool: "#source-map",
  rules: [
    {
      test: /\.js$/,
      use: ["source-map-loader"],
      enforce: "pre"
    }
  ]
};

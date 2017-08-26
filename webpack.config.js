module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
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
  entry: './src/root.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
  }
};

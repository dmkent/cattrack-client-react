module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"}
    ]
  },
  entry: './src/root.js',
  output: {
    path: __dirname,
    filename: 'bundle.js',
  }
};

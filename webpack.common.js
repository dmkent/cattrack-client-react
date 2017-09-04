const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: "babel-loader"},
      { test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
      { test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/, loader: 'url-loader',
        options: {
          limit: 10000
        }
      },
    ]
  },
  entry: {
    bundle: './src/root.js',
    vendor: [
      'react',
      'react-dom',
      'react-bootstrap',
      'react-router-bootstrap',
      'react-dates',
      'react-router-dom',
      'react-router-redux',
      'react-router',
      'react-intl',
      'react-redux',
      'babel-preset-react',
      'redux',
      'redux-thunk',
      'immutable',
      'xhr',
      './src/client/PlotlyWrapper.js'
    ]
  },
  output: {
    path: __dirname + '/dist/',
    filename: '[name].js',
  },
  plugins: [
    new HtmlWebpackPlugin({
      //title: "CatTrack",
      template: 'src/index.html.tmpl',
      //inject: 'body',
      filename: 'index.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['vendor'],
      minChunks: Infinity
    }),
    new webpack.SourceMapDevToolPlugin({
      exclude: "vendor.js",
      filename: '[file].map',
    }),
    new ExtractTextPlugin("[name].css")
  ]
};

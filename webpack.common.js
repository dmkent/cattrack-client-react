const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const GitRevisionPlugin = require('git-revision-webpack-plugin')
const path = require('path');

const gitRev = new GitRevisionPlugin();

module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [{loader: "babel-loader"}]
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
        ],
      },
      {
        test: /\.(png|jpg|gif|svg|eot|ttf|woff|woff2)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10000
            }
          },
        ]
      }
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
    ],
    plotly: './src/client/PlotlyWrapper.js'
  },
  output: {
    path: path.join(__dirname, '/dist/'),
    filename: '[name].js',
  },
  optimization: {
    splitChunks: {},
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'src/index.html.tmpl',
      filename: 'index.html'
    }),
    new webpack.SourceMapDevToolPlugin({
      exclude: ["vendor.js", "plotly.js"],
      filename: '[file].map',
    }),
    new MiniCssExtractPlugin({filename: "[name].css"}),
    new webpack.DefinePlugin({
      VERSION: '"now"' // JSON.stringify(gitRev.version())
    }),
    // gitRev,
  ]
};
const webpack = require('webpack');
const path = require('path');
const precss = require('precss');
const autoprefixer = require('autoprefixer')({browsers: 'last 2 versions'});
var ExtractTextPlugin = require("extract-text-webpack-plugin");

const config = {
  context: __dirname,
  entry: {
    main: [ './src/tmc-web-client.js' ],
  },
  output: {
    path: path.join(__dirname, 'demo', 'assets'),
    filename: 'tmc-web-client.js'
  },
  externals: {
    "jquery": "jQuery",
    "jszip": "JSZip",
    "jszip-utils": "JSZipUtils",
    "clipboard": "Clipboard",
    "ace": "ace"
  },
  devtool: "#inline-source-map",
  module: {
    loaders: [
      {
          test: /\.(scss|sass)$/,
          loader: ExtractTextPlugin.extract('style', ['css-loader', 'postcss-loader', 'sass-loader'])
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015', 'stage-3'],
          plugins: ['transform-runtime']
        }
      },
      {
        test: /\.template$/,
        loader: "handlebars-loader"
      }
    ]
  },
  postcss: () => {
    return [autoprefixer, precss];
  },

  sassLoader: {
    includePaths: [path.join(__dirname, 'src', 'css')]
  },

  plugins: [
    new ExtractTextPlugin('tmc-web-client.css')
  ]
}
module.exports = config;

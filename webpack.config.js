const webpack = require('webpack');
const path = require('path');

const sassLoaders = [
  'sass-loader?indentedSyntax=sass'
]

const config = {
  context: __dirname,
  entry: {
    main: [ './src/tmc-web-client.js' ],
  },
  output: {
    path: path.join(__dirname, 'demo', 'assets', 'js'),
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
          test: /\.sass$/,
          loaders: ["style", "css", "sass"]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      },
      {
        test: /\.template$/,
        loader: "handlebars-loader"
      }
    ]
  }
}
module.exports = config;

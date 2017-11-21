const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

const src = path.join(__dirname, './src');
const out = path.join(__dirname, './lib');

module.exports = {

  entry: path.join(src, 'index.js'),

  output: {
    path: out,
    filename: 'bytearenaviz.min.js',
  },

  plugins: [
    new HtmlWebpackPlugin({
      title: 'Viz',
      filename: path.join(out, 'index.html'),
      template: path.join(src, 'index.html'),
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules\/(?!charcodes))/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              'emotion',
              '@babel/plugin-proposal-class-properties',
            ],
            presets: [
              '@babel/preset-flow',
              '@babel/preset-react',
              ['@babel/preset-env', {debug: true, modules: false}],
            ],
          },
        },
      },
    ],
  },
};

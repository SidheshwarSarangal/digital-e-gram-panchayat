const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true, // Automatically clean the dist folder before each build
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/, // Handle .js and .jsx files
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/, // Handle CSS files
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg|woff|woff2|eot|ttf|otf)$/, // Handle image and font files
        type: 'asset/resource', // Treat these as resources
      },
    ],
  },
  devServer: {
    static: './dist',
    open: true, // Automatically open the browser
    hot: true, // Enable Hot Module Replacement (HMR)
    port: 8080,
    historyApiFallback: true, // Support React Router (fallback to index.html)
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new webpack.ProvidePlugin({
      process: 'process/browser', // Polyfill process for browser environments
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.mjs'], // Allow .mjs files and others
    fallback: {
      buffer: require.resolve('buffer/'),
      crypto: require.resolve('crypto-browserify'), // Ensure crypto fallback is present
      stream: require.resolve('stream-browserify'),
      util: require.resolve('util/'),
      vm: require.resolve('vm-browserify'),
      path: require.resolve('path-browserify'), // Polyfill for 'path'
      os: require.resolve('os-browserify/browser'), // Polyfill for 'os'
    },
  },
  mode: 'development', // Set the mode to development by default
};

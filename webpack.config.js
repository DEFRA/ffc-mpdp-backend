const path = require('path')

const { CleanWebpackPlugin } = require('clean-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'

console.log(`Running webpack in ${isDev ? 'development' : 'production'} mode`)

module.exports = {
  entry: './app/index.ts',
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [
      {
        test: /\.tsx?/,
        use: 'ts-loader',
        exclude: /node_modules/
      },
      {
        test: /.node$/,
        loader: 'node-loader',
      }
    ]
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'app/dist'),
  },
  resolve: {
    extensions: [ '.ts', '.js' ],
    // fallback: { 
    //   "os": require.resolve("os-browserify/browser"),
    //   "crypto": require.resolve("crypto-browserify"),
    //   "path": require.resolve("path-browserify"),
    //   "stream": require.resolve("stream-browserify"),
    //   "zlib": require.resolve("browserify-zlib"),
    //   "https": require.resolve("https-browserify"),
    //   "fs": false
    // }
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  target: 'node',
  devtool:'source-map',
}

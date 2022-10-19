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
    extensions: [ '.ts', '.js' ]
  },
  plugins: [
    new CleanWebpackPlugin()
  ],
  target: 'node',
  devtool:'source-map',
}

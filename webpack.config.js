const webpack = require('webpack')

module.exports = {
  entry: {
    main: ['./js/main.js'],
  },
  output: {
    path: './build/js',
    filename: 'all.js',
  },
  module: {
    loaders: [
      { test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
      },
      { test: /\.(less|css)$/,
        exclude: /node_modules/,
        loader: 'style!css!less',
      },
      { test: /\.(ttf|otf|eot|svg|woff(2)?)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url?limit=100000'
      }
    ],
  },
  devtool: 'eval',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
      },
    }),
  ],
}

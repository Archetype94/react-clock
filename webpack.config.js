const
  path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  { CleanWebpackPlugin } = require('clean-webpack-plugin')

module.exports = env => {
  const
    devMode = env != undefined ? env.dev : false,
    devTool = devMode ? 'eval-source-map' : '',
    mode = devMode ? 'development' : 'production'

  console.log('Enviroment:', mode)

  return {
    mode: mode,
    devtool: devTool,
    entry: './src/index.jsx',
    output: {
      filename: 'main.js',
      path: path.resolve(__dirname, 'dist'),
    },
    watchOptions: {
      ignored: /node_modules/
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: 'src/index.html'
      }),
    ],
    module: {
      rules: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: devMode, },
            },
          ],
        },
        {
          test: /\.s[ac]ss$/i,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: devMode, },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: devMode, },
            },
            {
              loader: 'sass-loader',
              options: { sourceMap: devMode, },
            },
          ],
        },
        {
          test: /\.less$/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: { sourceMap: devMode, },
            },
            {
              loader: 'postcss-loader',
              options: { sourceMap: devMode, },
            },
            {
              loader: 'less-loader',
              options: { sourceMap: devMode, },
            },
          ],
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          use: ['file-loader', ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader', ],
        },
      ],
    },
  }
}
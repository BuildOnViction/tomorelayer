const style = [
  '@neutrinojs/style-loader',
  {
    test: /\.(css|sass|scss)$/,
    moduleTest: /\.module\.(css|sass|scss)$/,
    loaders: ['sass-loader']
  }
]

const react = [
  '@neutrinojs/react',
  {
    html: {
      title: 'Epic React App'
    },
    devServer: {
      port: 3000
    }
  }
]

module.exports = {
  use: [
    '@neutrinojs/env',
    react,
    (neutrino) => neutrino.config.entry('vendor').add('react').add('react-dom'),
    style
  ],
  options: {
    source: 'frontend',
    output: 'frontend/dist'
  }
}

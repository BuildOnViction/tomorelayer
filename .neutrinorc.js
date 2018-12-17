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
      title: 'Epic React App',
      links: [
        'https://fonts.googleapis.com/css?family=Roboto',
        {
          href: '/static/apple-touch-icon.png',
          rel: 'apple-touch-icon',
          sizes: '180x180'
        },
        {
          href: '/static/favicon.ico',
          rel: 'icon',
          sizes: '32x32',
          type: 'image/png'
        }
      ],
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

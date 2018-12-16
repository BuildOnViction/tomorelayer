const template = [
  '@neutrinojs/html-template',
  {
    inject: true,
    appMountId: 'root',
    title: 'React Application',
    xhtml: true,
    mobile: true,
    minify: {
      useShortDoctype: true,
      keepClosingSlash: true,
      collapseWhitespace: true,
      preserveLineBreaks: true
    }
  }
]

const style = [
  '@neutrinojs/style-loader',
  {
    test: /\.(css|sass|scss)$/,
    moduleTest: /\.module\.(css|sass|scss)$/,
    loaders: ['sass-loader']
  }
]

module.exports = {
  use: [
    '@neutrinojs/env',
    '@neutrinojs/react',
    style,
    template
  ],
  options: {
    source: 'frontend'
  }
}

import {
  FuseBox,
  CopyPlugin,
  JSONPlugin,
  SassPlugin,
  CSSPlugin,
  CSSResourcePlugin,
  WebIndexPlugin,
  QuantumPlugin,
} from 'fuse-box'

import {
  src,
  task,
} from 'fuse-box/sparky'

const isProduction = process.env.STG === 'production'
const assetExts = ['ico', 'jpg', 'png'].map(ex => `static/*.${ex}`)

const config = {
  homeDir: '.',
  output: 'dist/$name.js',
  target: 'browser@esnext',
  allowSyntheticDefaultImports: true,
  hash: isProduction,
  cache: !isProduction,
  log: {
    showBundledFiles: true,
    clearTerminalOnBundle: true,
  },
  autoImport: {
    React: 'react',
  },
  alias: {
    '@route': '~/component/route',
    '@shared': '~/component/shared',
    '@utility': '~/component/utility',
    '@constant': '~/service/constant',
  },
  plugins: [
    WebIndexPlugin({ template: 'index.html' }),
    CopyPlugin({ files: assetExts }),
    [
      SassPlugin({ importer: true }),
      CSSResourcePlugin({ inline: true }),
      CSSPlugin({
        inject: file => `${file}`,
        outFile: file => `dist/${file}`,
      }),
    ],
    JSONPlugin(),
    isProduction && QuantumPlugin({
      treeshake: true,
      uglify: true,
      bakeApiIntoBundle: 'app',
    }),
  ],
  sourceMaps: !isProduction,
}

task('clean_all', () => src('dist').clean('dist').exec())
task('default', ['clean_all'], () => {
  const fuse = FuseBox.init(config)
  const bundle = fuse.bundle('app')
  if (!isProduction) {
    fuse.dev({ port: 3000 })
    bundle
      .watch('*.(ts|tsx|scss|jpg|png)')
      .hmr()
  }
  bundle.instructions('> index.tsx')
  return fuse.run()
})

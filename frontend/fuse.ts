import {
  FuseBox,
  CopyPlugin,
  JSONPlugin,
  SassPlugin,
  CSSPlugin,
  WebIndexPlugin,
  QuantumPlugin,
} from 'fuse-box'

import {
  src,
  task,
} from 'fuse-box/sparky'

const isProduction = process.env.STG === 'production'

const config = {
  homeDir: '.',
  output: 'dist/$name.js',
  target: 'browser@esnext',
  useTypescriptCompiler: true,
  allowSyntheticDefaultImports: true,
  hash: isProduction,
  cache: !isProduction,
  log: {
    showBundledFiles: false,
    clearTerminalOnBundle: true,
  },
  alias: {
    '@route': '~/component/route',
    '@shared': '~/component/shared',
    '@constant': '~/service/constant',
  },
  plugins: [
    WebIndexPlugin({ template: 'index.html' }),
    CopyPlugin({ files: ['static/*.ico'] }),
    [
      SassPlugin(),
      CSSPlugin({
        inject: file => `${file}`,
        outFile: file => `dist/${file}`,
      })
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
      .watch('(component|service|style)/**/*.(ts|tsx|scss)')
      .hmr()
  }
  bundle.instructions('> index.tsx')
  return fuse.run()
})

import {
  CSSPlugin,
  CSSResourcePlugin,
  QuantumPlugin,
  SassPlugin,
  WebIndexPlugin,
} from 'fuse-box'

export default function fuseConfig(isProduction = false) {
  return {
    homeDir: '.',
    output: 'dist/$name.js',
    target: 'browser@esnext',
    hash: isProduction,
    cache: !isProduction,
    allowSyntheticDefaultImports: true,
    autoImport: {
      React: 'react',
      r: 'ramda',
    },
    log: {
      showBundledFiles: !isProduction,
      clearTerminalOnBundle: true,
    },
    plugins: [
      WebIndexPlugin({ template: 'index.html' }),
      [
        SassPlugin(),
        CSSPlugin({
          inject: file => `${file}`,
          outFile: file => `dist/${file}`,
          minify: isProduction,
        }),
      ],
      isProduction && QuantumPlugin({
        bakeApiIntoBundle: 'app',
        css: true,
        ensureES5: true,
        removeExportsInterop: true,
        treeshake: true,
        uglify: true,
      }),
    ],
    sourceMaps: !isProduction,
  }
}

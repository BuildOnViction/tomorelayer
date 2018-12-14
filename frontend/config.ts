import {
  CSSPlugin,
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
      React: "react",
      r: "ramda",
    },
    log: {
      showBundledFiles: false,
      clearTerminalOnBundle: true,
    },
    plugins: [
      WebIndexPlugin({ template: 'index.html' }),
      [
        SassPlugin(),
        CSSPlugin({
          inject: file => `${file}`,
          outFile: file => `dist/asset/${file}`,
          minify: isProduction
        })
      ],
      isProduction && QuantumPlugin({
        bakeApiIntoBundle: 'root',
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

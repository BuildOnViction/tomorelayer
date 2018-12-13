import {
  FuseBox,
} from 'fuse-box'

import {
  src,
  task,
} from 'fuse-box/sparky'

import fuseConfig from './config'

const isProduction = process.env.NODE_ENV === 'production'

task('clean_all', () => src('build').clean('build').exec())
task('default', ['clean_all'], () => {
  const config = fuseConfig(isProduction)
  const fuse = FuseBox.init(config)
  fuse.dev({ httpServer: !isProduction, hmr: true, port: 4444 })
  fuse.bundle('root')
    .watch('/**/*.(ts|tsx)')
    .hmr()
    .instructions('> root.tsx')
  return fuse.run()
})

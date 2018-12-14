import { FuseBox } from 'fuse-box'
import { src, task } from 'fuse-box/sparky'
import fuseConfig from './config'

const isProduction = process.env.NODE_ENV === 'production'

task('clean_all', () => src('dist').clean('dist').exec())
task('default', ['clean_all'], () => {
  const config = fuseConfig(isProduction)
  const fuse = FuseBox.init(config)
  fuse.dev({ httpServer: !isProduction, hmr: true, port: 4444 })
  fuse.bundle('app')
    .watch('/**/*.(tsx|ts)')
    .hmr()
    .instructions('> app.tsx')
  return fuse.run()
})

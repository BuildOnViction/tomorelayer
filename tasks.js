const sh = require('shelljs')
const chalk = require('chalk')
const sig = require('signale')
const fs = require('fs')
const { task } = require('fuse-box/sparky')

require('dotenv').config()

const args = []
process.argv.forEach(arg => args.push(arg))

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST,
} = process.env

const database = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`


// TASKS
task('kill-port', () => {
  const killablePort = args[3]
  if (!killablePort) {
    sig.fatal(`Some port is required: ${killablePort}`)
    process.exit(1)
  }
  sh.exec(`kill-port ${killablePort}`)
})

task('docker', () => sh.exec('docker-compose -f docker-compose.dev.yaml up -d'))

task('embark', () => {
  const availableNetworks = ['development', 'ropsten']
  const network = args[3] || 'development'

  if (!availableNetworks.includes(network)) {
    sig.fatal(`Unrecognized Network: ${chalk.white.bgRed.bold(network)}`)
    process.exit(0)
  }

  sig.fav(`Blockchain Network: ${chalk.green.bold(network.toUpperCase())}`)
  sh.exec('rsync -a embark/plugin.js node_modules/embark-tomo/')
  sig.complete('Copied custom plugin')
  sh.exec(`embark run --nobrowser --noserver --nodashboard ${network}`)
})


task('db:migrate', () => {
  // Reserved for future migration commmands
})

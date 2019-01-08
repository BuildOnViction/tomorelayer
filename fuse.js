const sh = require('shelljs')
const clk = require('chalk')
const { task } = require('fuse-box/sparky')

// Pre-run config
require('dotenv').config()
require('pretty-error').start()
// const pe = new PrettyError()

// Collecting command-line arguments
const args = []
process.argv.forEach((val, index, array) => args.push(val))

// Scanning...
const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_PORT,
  DB_HOST,
} = process.env

const database = `postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`

// Yahoooooooooo...
task('fe', () => sh.exec('node -r dotenv/config -r ts-node/register --inspect frontend/fuse.ts'))
task('be', () => sh.exec('pipenv run python ./backend/app.py'))
task('dock', () => sh.exec('docker-compose -f docker-compose.dev.yaml up -d'))
task('embark:compile', () => sh.exec('embark run --nobrowser --noserver'))

/*
 * Database is a liiiiiiiiiilttle more complicated
 * we need to write migration script ourselves, instead of Django Magic...
 * and, we need to run migrate command afterwards
 */
task('db:create', () => {
  const mig_name_fmt = clk.green.bold('Migration_Name')
  const migrationName = args[3]
  const ArgsError = new Error(`Missing ${mig_name_fmt}. Passing an argument as ${mig_name_fmt}`)
  const cmd = `pipenv run pw_migrate create --auto-source=backend --database=${database} --verbose ${migrationName}`
  return migrationName ? sh.exec(cmd) : console.log(ArgsError)
})

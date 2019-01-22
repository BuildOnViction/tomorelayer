const sh = require('shelljs')
const clk = require('chalk')
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
task('docker', () => sh.exec('docker-compose -f docker-compose.dev.yaml up -d'))
task('embark:build', () => sh.exec('embark build'))
task('')


task('db:migrate', () => {
  // Reserved for future migration commmands
})

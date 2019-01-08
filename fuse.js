const { task } = require('fuse-box/sparky')
const sh = require('shelljs')
require('dotenv').config()


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

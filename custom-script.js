const execSh = require('exec-sh')
const localtunnel = require('localtunnel')
const killPort = require('kill-port')
const path = require('path')
const envfile = `.env.${process.env.NODE_ENV}`
const envpath = path.resolve(__dirname, envfile)
require('dotenv').config({ path: envpath })

const port = 8888

killPort(port).then(() => {
  localtunnel(port, (err, tunnel) => {
    if (err) return console.error(err)
    const baseUrl = tunnel.url
    console.info(baseUrl)
    execSh(`TUNNEL_URL=${baseUrl} ENV_PATH=${envfile} pipenv run python ./backend/app.py`)
  })
})

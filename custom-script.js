const execSh = require('exec-sh')
const localtunnel = require('localtunnel')
const killPort = require('kill-port')
require('dotenv').config()

const port = process.env.REACT_APP_PORT

killPort(port).then(() => {
  localtunnel(port, (err, tunnel) => {
    if (err) return console.error(err)
    const baseUrl = tunnel.url
    console.info(baseUrl)
    execSh(`TUNNEL_URL=${baseUrl} ENV_PATH=.env pipenv run python ./backend/app.py`)
  })
})

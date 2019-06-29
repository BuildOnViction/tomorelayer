const execSh = require('exec-sh')
const localtunnel = require('localtunnel')
const killPort = require('kill-port')
const path = require('path')
const envfile = `.env.${process.env.NODE_ENV}`
const envpath = path.resolve(__dirname, envfile)
const request = require('request')

require('dotenv').config({ path: envpath })

const port = 8888



killPort(port).then(() => {

  request('https://localtunnel.me', (err, res) => {
    const status = res.statusCode

    if (status <400) {
      localtunnel(port, (err, tunnel) => {
        if (err) return console.error(err)
        const baseUrl = tunnel.url
        console.info(baseUrl)
        execSh(`TUNNEL_URL=${baseUrl} ENV_PATH=${envfile} pipenv run python ./backend/app.py`)
      })
    } else {
      console.log('LocalTunnel is Offline, run local app')
      execSh(`ENV_PATH=${envfile} pipenv run python ./backend/app.py`)
    }
  })

})

const execSh = require('exec-sh')
const localtunnel = require('localtunnel')
const killPort = require('kill-port')
const path = require('path')
const envfile = `.env.${process.env.NODE_ENV}`
const envpath = path.resolve(__dirname, envfile)
const request = require('request')

require('dotenv').config({ path: envpath })

const port = process.env.NODE_ENV === 'test' ? 8889 : 8888



killPort(port).then(() => {
  console.log('Disable LocalTunnel, run local app')
  execSh(`ENV_PATH=${envfile} pipenv run python ./backend/app.py`)

  /* request('https://localtunnel.me', (err, res) => {
   *   if (err) {
   *     console.log('LocalTunnel is Err..., run local app')
   *     return execSh(`ENV_PATH=${envfile} pipenv run python ./backend/app.py`)
   *   }

   *   const status = res.statusCode

   *   if (status <400) {
   *     localtunnel(port, (err, tunnel) => {
   *       if (err) {
   *         return console.error(err)
   *       }
   *       const baseUrl = tunnel.url
   *       console.info(baseUrl)
   *       execSh(`TUNNEL_URL=${baseUrl} ENV_PATH=${envfile} pipenv run python ./backend/app.py`)
   *     })
   *   } else {
   *     console.log('LocalTunnel is Offline, run local app')
   *     execSh(`ENV_PATH=${envfile} pipenv run python ./backend/app.py`)
   *   }
   * }) */

})

const execSh = require('exec-sh')
const localtunnel = require('localtunnel')

require('dotenv').config()

localtunnel(process.env.REACT_APP_PORT, (err, tunnel) => {
  if (err) return console.error(err)
  const baseUrl = tunnel.url
  console.info(baseUrl)
  execSh(`TUNNEL_URL=${baseUrl} pipenv run python ./backend/app.py`)
})

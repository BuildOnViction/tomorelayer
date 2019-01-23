const fs = require('fs')
require('dotenv').config()

module.exports = function(embark) {
  // NOTE: we save the addresses of deployed contract to external json file
  // so Tornando can load them on start

  const isProduction = process.env.STG === 'production'
  let contracts = []
  let file = 'contracts.json'

  const info = embark.logger.info

  embark.events.on('deploy:beforeAll', () => {
    info(`========= is this production? ${isProduction}`)
    info(`>> Clear the existing ${file}`)
    fs.writeFile(file, '', 'utf8', err => {
      if (err) throw err
      info(`${file} created!`)
    })
  })

  embark.events.on('deploy:contract:deployed', contract => {
    contracts.push(contract)
  })

  embark.events.on('contractsDeployed', () => {
    info(">> All contracts deployed!")
    try {
      fs.appendFileSync(file, JSON.stringify(contracts))
      info('[ok] The data was appended to file!')

      if (isProduction) {
        // We terminate the dashboard after the deployment has been done!
        process.exit(0)
      }
    } catch (err) {
      info(`[x] Cannot save to ${file}`)
    }
  })

}

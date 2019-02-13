const fs = require('fs')
require('dotenv').config()

module.exports = function(embark) {
  // NOTE: we save the addresses of deployed contract to external json file
  // so Tornando can load them on start

  const isProduction = process.env.STG === 'production'
  const contracts = []
  const file = 'contracts.json'
  const { info, warn, error } = embark.logger

  embark.events.on('deploy:beforeAll', () => {
    warn(`====================== is this production? ${isProduction}`)
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
      error(`[x] Cannot save to ${file}`)
    }
  })

}

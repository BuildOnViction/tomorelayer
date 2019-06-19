import Sequelize from 'sequelize'

const fs = require('fs')
const path = require('path')

const setup = async () => {
  const TEST_DB_URI = 'postgres://postgres:root@localhost:5434/postgres'
  const sequelize = new Sequelize(TEST_DB_URI, {
    logging: void 0,
  })

  const Contract = sequelize.define('contract', {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    abi: {
      type: Sequelize.JSONB,
      allowNull: false,
    },
    obsolete: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    timestamps: false,
    tableName: 'contract',
  })

  await sequelize.drop()
  await sequelize.sync({ force: true })

  const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/relayer.abi.json')))
  await Contract.create({
    name: 'RelayerRegistration',
    address: '0x000000000001',
    abi,
  })

  return {
    conn: sequelize,
    Contract,
  }
}

export default setup

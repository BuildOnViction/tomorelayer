import Sequelize from 'sequelize'

export const TEST_DB_URI = 'postgres://postgres:root@localhost:5434/postgres'
export const TEST_CONTRACT_ADDRESS = '0x6214de5b30c872e09db48e88798476ecce8c8da2'

const setup = async () => {
  const sequelize = new Sequelize(TEST_DB_URI, {
    logging: undefined,
  })

  const Contract = sequelize.define(
    'contract',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      owner: {
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
        defaultValue: false,
      },
    },
    {
      timestamps: false,
      tableName: 'contract',
    },
  )

  const Relayer = sequelize.define(
    'relayer',
    {
      owner: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      coinbase: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      deposit: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      trade_fee: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      from_tokens: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      to_tokens: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: false,
        defaultValue: [],
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      link: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resigning: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      lock_time: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
    },
    {
      timestamps: false,
      tableName: 'relayer',
    },
  )

  const Token = sequelize.define(
    'token',
    {
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      symbol: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      logo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      total_supply: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_major: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    },
    {
      timestamps: false,
      tableName: 'token',
    },
  )

  await sequelize.drop()
  await sequelize.sync({ force: true })

  return {
    conn: sequelize,
    Contract,
    Relayer,
    Token,
  }
}

export default setup

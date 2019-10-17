import faker from 'faker'
import setup from './db.setup'
import * as http from 'service/backend'
import * as _ from 'service/helper'

let db = undefined

beforeAll(async () => {
  db = await setup()
})

describe('Testing backend API', () => {
  it('Clean DB connected', async () => {
    const count = await db.Contract.count()
    expect(count).toEqual(0)
  })

  it('Create 2(two) contracts:  RelayerRegistration Contract & TomoXListing Contract', async () => {
    const fs = require('fs')
    const path = require('path')

    const relayerContractAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/relayer_contract.abi.json')))
    const relayerContractPayload = {
      name: 'RelayerRegistration',
      address: '0x15f03b4fcedbc31c79d2063bd3bbc60440a637e3',
      owner: '0x7BfF9cABAD18efFeC42788EFc473Dd39C90116Aa',
      abi: relayerContractAbi,
    }

    const tomoXContractAbi = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/tomox_contract.abi.json')))
    const tomoXContractPayload = {
      name: 'TOMOXListing',
      address: '0xdf520ab4656aa2c7e4fff6ebd5b7378109600b67',
      owner: 'empty',
      abi: tomoXContractAbi,
    }

    // NOTE: mocking storage...
    Storage.prototype.getItem = jest.fn(() => 'admin-secret')
    const { error, ...result } = await http.createContracts([relayerContractPayload, tomoXContractPayload])
    expect(error).toBeFalsy()
    expect(result).toBeTruthy()
  })

  it('Create 10(ten) tokens...', async () => {
    // Create a single token
    const singleToken = {
      name: faker.finance.currencyName(),
      symbol: faker.finance.currencyCode(),
      total_supply: faker.random.number(),
      address: faker.finance.bitcoinAddress(), // ethereumAddress is not available yet
    }

    const resp = await http.createTokens(singleToken)
    expect(resp.error).toBeFalsy()

    // Create multiple tokens
    const randomTokens = Array.from({ length: 10 }).map(() => ({
      name: faker.finance.currencyName(),
      symbol: faker.finance.currencyCode(),
      total_supply: faker.random.number(),
      address: faker.finance.bitcoinAddress(),
    }))

    const tokens = _.uniqueBy(randomTokens, 'address')

    const { error, ...result } = await http.createTokens(tokens)
    expect(error).toBeFalsy()
    expect(result).toBeTruthy()
  })

  it('Can create some relayer', async () => {
    const owner = '0x070aa7ad03b89b3278f19d34f119dd3c2a244675'
    const signature =
      '0x534a82e3de6fda201c54126be6892f035918fb6266637063a94c169411cfbf13283e95eb26587ace6d97a09430deff6cf96e6a39a880b4cfc63cabf3a9a0126c1b'
      const jwt = await http.getAuthenticated(owner, signature)

    expect(jwt.token.length).toBeTruthy()

    Storage.prototype.getItem = jest.fn(() => jwt.token)

    const relayer = {
      owner: owner + 'invalid_owner',
      deposit: "25000",
      name: 'Dummy Dex',
      coinbase: "0xdD596FfB7f7A6123C36ecEf2F8a48AfEc6D7B889",
      trade_fee: 2,
      from_tokens: [],
      to_tokens: [], // _.unique(_.times(faker.finance.ethereumAddress, 3)), ethereumAddress is not yet available in Fakerjs
    }

    const { error } = await http.createRelayer(relayer)
    expect(error).toBeTruthy()

    relayer.owner = owner
    const retry = await http.createRelayer(relayer)
    expect(retry.error).toBeFalsy()
  })
})

export default db

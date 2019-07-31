import setup, { TEST_CONTRACT_ADDRESS } from './_database.setup.js'
import * as http from 'service/backend'

const fs = require('fs')
const path = require('path')

let db, conn, Contract, Relayer, Token
let OWNER = '0x7BfF9cABAD18efFeC42788EFc473Dd39C90116Aa'

beforeAll(async () => {
  db = await setup()
  conn = db.conn
  Contract = db.Contract
  Relayer = db.Relayer
  Token = db.Token
})

afterAll(async () => {
  await conn.drop()
  await conn.close()
})

describe('Testing Contract API', () => {
  it('#1. manually save a contract to Database', async (done) => {
    await http.getAuthenticated(OWNER)

    let count = await Contract.count()
    expect(count).toEqual(0)

    const abi = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/_relayer.abi.json')))
    await Contract.create({
      name: 'RelayerRegistration',
      address: TEST_CONTRACT_ADDRESS,
      owner: '0xb33b85945534f3f2def26f3b3613a44448f2ccf9',
      abi,
    })

    count = await Contract.count()
    expect(count).toEqual(1)

    let payload = await http.getContracts()
    expect(payload.length).toEqual(1)

    const registrationContract = payload[0]
    expect(registrationContract.address).toBe(TEST_CONTRACT_ADDRESS)

    await Contract.create({
      name: 'RelayerRegistrationXXX',
      address: 'xxx',
      abi,
    })

    payload = await http.getContracts()
    expect(payload.length).toEqual(2)

    // contractId = registrationContract.id
    done()
  })

  it.skip('#2. Update contract status', async () => {
    /* NOTE: not implemented yet
     * for admin only
     */
    /* const updatedContract = await http.updateContract({
     *   id: contractId,
     *   obsolete: true,
     * })
     * expect(updatedContract.id).toBe(contractId)
     * expect(updatedContract.obsolete).toBe(true) */
  })
})

describe('Testing Relayer API', () => {
  let relayerId

  it('#1. create a relayers', async (done) => {
    const count = await Relayer.count()
    expect(count).toEqual(0)

    const fakeOwner = '0x070aA7AD03B89B3278f19d34F119DD3C2a244675'

    const dummyRelayer = {
      owner: fakeOwner,
      name: 'DummyRelayer',
      coinbase: '0xdD596FfB7f7A6123C36ecEf2F8a48AfEc6D7B889',
      deposit: 25000,
      trade_fee: 2,
      from_tokens: [],
      to_tokens: [],
    }

    // Authenticated User doesnt match Relayer Owner
    const response = await http.createRelayer(dummyRelayer)
    expect(response.error).toBeTruthy()

    dummyRelayer.owner = OWNER
    const newRelayer = await http.createRelayer(dummyRelayer)
    expect(newRelayer.id).toBe(1)

    const getRelayers = await http.getRelayers()
    expect(getRelayers.length).toBe(1)

    relayerId = newRelayer.id

    done()
    // NOTE: testing Failure API (logging, resopnse)
  })

  it('#2. update a relayer', async () => {
    const payload = {
      id: relayerId,
      trade_fee: 5,
      resigning: true,
    }
    let updatedRelayer = await http.updateRelayer(payload)

    // Missing owner - required to verify relayer-ownership quickly
    expect(updatedRelayer.error).toBeTruthy()

    payload.owner = OWNER
    updatedRelayer = await http.updateRelayer(payload)

    expect(updatedRelayer.id).toBe(1)
    expect(updatedRelayer.resigning).toBe(true)
    expect(updatedRelayer.trade_fee).toBe(5)

    const missingIdRequest = await http.updateRelayer({ trade_fee: 5 })
    expect(Boolean(missingIdRequest.error)).toBe(true)
    expect(missingIdRequest.error.code).toBe(400)

    const invalidIdRequest = await http.updateRelayer({ id: 4, trade_fee: 6 })
    expect(Boolean(invalidIdRequest.error)).toBe(true)
    expect(invalidIdRequest.error.code).toBe(400)
  })

  it('#3. delete a relayer(after a successful refundEvent)', async () => {
    let request = await http.deleteRelayer(null)
    expect(request.error.code).toBe(400)

    request = await http.deleteRelayer(2)
    expect(request.error.code).toBe(400)

    request = await http.deleteRelayer(relayerId)
    expect(Boolean(request.error)).toBe(false)

    const count = await Relayer.count()
    expect(count).toEqual(0)
  })
})

describe('Testing Token API', () => {
  let request

  it('#1. get tokens', async () => {
    request = await http.getTokens()
    expect(request.length).toEqual(0)
  })

  it('#2. create new token', async () => {
    const tokens = JSON.parse(fs.readFileSync(path.resolve(__dirname + '/_token.dummy.json')))

    request = await fetch('http://localhost:8889/api/token', {
      method: 'POST',
      headers: {
        Accept: 'application/json; charset=UTF-8',
        Authorization: 'Bearer ' + process.env.SECRET_HEADER,
      },
      body: JSON.stringify(tokens[0]),
    })
      .then(http.genericHandler)
      .then(http.getPayload)

    expect(Boolean(request.id)).toBe(true)

    request = await http.getTokens()
    expect(request.length).toEqual(1)

    // 4 more dummy tokens to be created
    await Promise.all(tokens.slice(1).map(async (t) => Token.create(t)))

    request = await http.getTokens()
    expect(request.length).toEqual(5)
  })
})

describe('Testing public API', () => {
  let request

  it('Get all public resources', async () => {
    request = await http.getPublicResource()
    expect(request.Contracts.length).toEqual(2)
    expect(request.Relayers.length).toEqual(0)
    expect(request.Tokens.length).toEqual(5)
  })
})

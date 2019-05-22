/* global web3, assert, config, contract */
/* eslint no-unused-expressions: 0 */
require('dotenv').config()
const expect = require('chai').expect

const RelayerRegistration = require('Embark/contracts/RelayerRegistration')
const TokenOne = require('Embark/contracts/TokenOne')
const TokenTwo = require('Embark/contracts/TokenTwo')
const TokenThree = require('Embark/contracts/TokenThree')

let accounts = []


// Embark Testing Setup, refer to original dev-setup in ./contracts.js
config({
  deployment: {
    accounts: [
      {
        mnemonic: process.env.MNEMONIC,
        addressIndex: 0,
        numAddresses: 9,
        balance: "60000 ether",
      }
    ]
  },
  contracts: {
    RelayerRegistration: {
      fromIndex: 0,
      args: [2, 4, 22],
    },
    Token: { deploy: false, },
    ERC20: { deploy: false },
    ERC20Capped: { deploy: false, },
    ERC20Mintable: { deploy: false, },
    ERC20Detailed: { deploy: false, },
    SafeMath: { deploy: false, },
    Roles: { deploy: false, },
    TokenOne: {
      fromIndex: 1,
      instanceOf: 'Token',
      args: ["TOKEN1", "TOK1", 1000, 0],
    },
    TokenTwo: {
      fromIndex: 2,
      instanceOf: 'Token',
      args: ["TOKEN2", "TOK2", 2000, 0],
    },
    TokenThree: {
      fromIndex: 3,
      instanceOf: 'Token',
      args: ["TOKEN3", "TOK3", 5000, 0],
    },
  }
}, (err, acc) => {
  accounts = acc
})


// Testing Contracts
contract('Token ERC-20', () => {

  it.skip('successfully created 2 erc20 tokens with correct symbols', async () => {
    const symbol1 = await TokenOne.methods.symbol().call()
    const symbol2 = await TokenTwo.methods.symbol().call()
    assert.equal(symbol1, 'TOK1')
    assert.equal(symbol2, 'TOK2')
  })

  it.skip('initialized with proper minted-token allocations', async () => {
    const allocate1 = await TokenOne.methods.balanceOf(accounts[1]).call()
    assert.equal(allocate1, 100)
    const allocate2 = await TokenTwo.methods.balanceOf(accounts[2]).call()
    assert.equal(allocate2, 200)
  })

})

contract('RelayerRegistration', async () => {

  // Common & util functions
  const toWei = n => typeof n === 'string' ? web3.utils.toWei(n) : web3.utils.toWei(n.toString())
  let registrationPayload = []
  let response = undefined
  let minDeposit = 22000
  let maxRelayers = 2
  const Address_Zero = '0x0000000000000000000000000000000000000000'

  const register = async (fee, account, customPayload = {}) => await RelayerRegistration.methods.register(...Object.values({
    ...registrationPayload,
    ...customPayload,
  })).send({
    from: account,
    gas: '1000000',
    value: toWei(fee),
  }).then(resp => {
    return { status: true, details: resp.events.RegisterEvent.returnValues }
  }).catch(err => {
    return { status: false, details: err }
  })

  const update = async (
    owner = accounts[1],
    coinbase = accounts[8],
    makerFee = registrationPayload.makerFee,
    takerFee = registrationPayload.takerFee,
    fromTokens = registrationPayload.fromTokens,
    toTokens = registrationPayload.toTokens,
  ) => RelayerRegistration.methods.update(coinbase, makerFee, takerFee, fromTokens, toTokens).send({ from: owner }).then(r => ({
    status: true,
    details: r.events.UpdateEvent.returnValues,
  })).catch(r => ({
    status: false,
    details: r
  }))

  const depositMore = async(coinbase = accounts[8], owner = accounts[1], amount) => RelayerRegistration.methods.depositMore(coinbase).send({
    from: owner,
    gas: '1000000',
    value: toWei(amount),
  }).then(resp => {
    return { status: true, details: resp.events.UpdateEvent.returnValues }
  }).catch(err => {
    return { status: false, details: err }
  })

  const changeOwnership = async (owner, coinbase, newowner, newcoinbase) => RelayerRegistration
    .methods.changeOwnership(coinbase, newowner, newcoinbase)
    .send({ from: owner }).then(success => ({
      status: true,
      details: success.events.ChangeOwnershipEvent.returnValues,
    })).catch(err => ({
      status: false,
      details: err,
    }))

  const resign = async (coinbase, owner) => RelayerRegistration
    .methods.resign(coinbase)
    .send({ from: owner, gas: '1000000' })
    .then(resp => ({ status: true, details: resp.events.ResignEvent.returnValues }))
    .catch(err => ({ status: false, details: err }))

  const getRelayerByOwner = async (owner) => RelayerRegistration
    .methods.getRelayerByOwner(owner)
    .call()
    .then(resp => ({ status: true, details: resp }))
    .catch(err => ({ status: false, details: err }))

  const getRelayerByCoinbase = async (coinbase) => RelayerRegistration
    .methods.getRelayerByCoinbase(coinbase)
    .call()
    .then(resp => ({ status: true, details: resp }))
    .catch(err => ({ status: false, details: err }))

  const refund = async (owner, coinbase) => RelayerRegistration
    .methods.refund(coinbase)
    .send({ from: owner, gas: '1000000' })
    .then(resp => ({ status: true, details: resp.events.RefundEvent.returnValues }))
    .catch(err => ({ status: false, details: err }))

  beforeEach(async () => {
    response = undefined
    minDeposit = 22000

    registrationPayload = {
      coinbase: accounts[8],
      makerFee: 1,
      takerFee: 2,
      fromTokens: [
        TokenOne.options.address,
        TokenTwo.options.address,
        TokenThree.options.address,
      ],
      toTokens: [
        TokenTwo.options.address,
        TokenThree.options.address,
        TokenOne.options.address,
      ]
    }
  })

  // Test suites
  it('CONTRACT CONFIGURATIONS: Min_deposit = 22,000 TOMO (not 25,000!); Max_relayer = 2 (for testing purpose)', async () => {
    const getMinDeposit = await RelayerRegistration.methods.MinimumDeposit().call()
    assert.equal(toWei(minDeposit), getMinDeposit)

    const getMaxRelayer = await RelayerRegistration.methods.MaximumRelayers().call()
    assert.equal(maxRelayers, getMaxRelayer)
  })

  it('REGISTRATION: conform to the rules about coinbase, naming, fees, trade-tokens', async () => {
    const applicant = accounts[1]

    // Must satisfy minimum deposit
    response = await register(minDeposit - 1, applicant)
    expect(response.status).to.be.false

    // Fee must be valid (1 ~ 999)
    response = await register(minDeposit, applicant, { takerFee: 0 })
    expect(response.status).to.be.false
    response = await register(minDeposit, applicant, { makerFee: 1000 })
    expect(response.status).to.be.false

    // Token pairs must match in length, not exceeding maxTokenList
    response = await register(minDeposit, applicant, { fromTokens: [ TokenOne.options.address ] })
    expect(response.status).to.be.false

    const customPayload = {
      fromTokens: [...registrationPayload.fromTokens, TokenOne.options.address, TokenTwo.options.address],
      toTokens: [...registrationPayload.fromTokens, TokenOne.options.address, TokenTwo.options.address],
    }

    response = await register(minDeposit, applicant, customPayload)
    expect(response.status).to.be.false

    // Finally, succeed with a valid payload
    response = await register(minDeposit, applicant)
    expect(response.status).to.be.true
  })


  it('UPDATE: should conform to regulations', async () => {
    response = await update(accounts[0])
    expect(response.status).to.be.false

    response = await update(undefined, accounts[2])
    expect(response.status).to.be.false

    response = await update(undefined, undefined, 0)
    expect(response.status).to.be.false

    response = await update(undefined, undefined, undefined, undefined, [ TokenTwo.options.address ])
    expect(response.status).to.be.false

    response = await update(undefined, undefined, 2)
    expect(response.status).to.be.true

    response = await update(undefined, undefined, undefined, 3)
    expect(response.status).to.be.true

    response = await update(undefined, undefined, undefined, undefined, [ TokenTwo.options.address ], [ TokenThree.options.address ])
    expect(response.status).to.be.true
  })


  it('COUNTING: count number of relayers, not allow registration if over maximum_relayers', async () => {
    // Through all the previous Tests, 3 RELAYERS have been created!
    response = await RelayerRegistration.methods.RelayerCount().call()
    expect(response).to.equal('1')

    response = await register(minDeposit, accounts[2], { coinbase: accounts[3] })
    expect(response.status).to.be.true

    // Cant register more than 2 relayer...
    response = await register(minDeposit, accounts[4], { coinbase: accounts[5] })
    expect(response.status).to.be.false
  })


  it('DEPOSIT: no zero-deposit, authorized-only', async () => {
    response = await depositMore(accounts[0], undefined, 1000)
    expect(response.status).to.be.false

    response = await depositMore(undefined, accounts[0], 1000)
    expect(response.status).to.be.false

    response = await depositMore(undefined, undefined, 0)
    expect(response.status).to.be.false

    response = await depositMore(undefined, undefined, 1000)
    expect(response.status).to.be.true
  })


  it('CHANGE OWNERSHIP: authorized-only, fresh-coinbase, confirming relayer-owned lists before and after change', async () => {
    const owner1 = {
      address: accounts[1],
      coinbase: [accounts[8]],
    }

    const owner2 = {
      address: accounts[2],
      coinbase: [accounts[3]],
    }

    response = await getRelayerByOwner(owner1.address)
    expect(response.details.length).to.equal(1)

    response = await getRelayerByOwner(owner2.address)
    expect(response.details.length).to.equal(1)

    response = await changeOwnership(owner1.address, owner2.coinbase[0], owner1.address, accounts[4])
    expect(response.status).to.be.false

    response = await changeOwnership(owner1.address, owner1.coinbase[0], owner1.address, accounts[4])
    expect(response.status).to.be.false

    response = await changeOwnership(owner1.address, accounts[4], owner2.address, accounts[5])
    expect(response.status).to.be.false

    response = await changeOwnership(owner1.address, owner1.coinbase[0], owner2.address, accounts[4])
    expect(response.status).to.be.true

    response = await getRelayerByOwner(owner2.address)
    expect(response.details.length).to.equal(2)
    expect(response.details[1]).to.equal(accounts[4])

    response = await getRelayerByCoinbase(accounts[4])
    expect(response.details[0]).to.equal(owner2.address)

    response = await getRelayerByOwner(owner1.address)
    expect(response.details.length).to.equal(1)
    expect(response.details[0]).to.equal(Address_Zero)

    // Transfer back to owner1...
    response = await changeOwnership(owner2.address, accounts[4], owner1.address, accounts[4])
    expect(response.status).to.be.true
  })


  it('RESIGN: process properly, unlock after designated time, clear all traces of resigned relayer', async () => {
    const owner1 = {
      address: accounts[1],
      coinbase: [accounts[4]],
    }

    const owner2 = {
      address: accounts[2],
      coinbase: [accounts[3]],
    }

    // Unauthorized request
    response = await resign(owner1.coinbase[0], owner2.address)
    expect(response.status).to.be.false
    response = await resign(owner2.coinbase[0], owner1.address)
    expect(response.status).to.be.false

    // Successful request
    response = await resign(owner1.coinbase[0], owner1.address)
    expect(response.status).to.be.true
    // No submit resignation twice!
    response = await resign(owner1.coinbase[0], owner1.address)
    expect(response.status).to.be.false

    // Check time...
    // No update, no transfer...
    response = await update(owner1.address, owner1.coinbase[0])
    expect(response.status).to.be.false
    response = await changeOwnership(owner1.address, owner1.coinbase[0], owner2.address, accounts[5])
    expect(response.status).to.be.false

    // Unlock
    const waitingTimeInSeconds = 4
    response = await refund(owner1.address, owner1.coinbase[0])
    const remaining_time = parseInt(response.details.remaining_time)
    expect(remaining_time <= waitingTimeInSeconds).to.be.true

    const unlock = new Promise(resolve => {
      setTimeout(async () => {
        const roundUp = weiAmount => Math.ceil(parseFloat(web3.utils.fromWei(weiAmount)), 0)

        response = await refund(owner2.address, owner1.coinbase[0])
        expect(response.status).to.be.false

        let balance = await web3.eth.getBalance(owner1.address)
        expect(roundUp(balance)).to.equal(37000)

        response = await refund(owner1.address, owner1.coinbase[0])
        expect(response.details.success).to.be.true

        balance = await web3.eth.getBalance(owner1.address)
        expect(roundUp(balance)).to.equal(60000)

        resolve()
      }, 1000 * waitingTimeInSeconds + 1000)
    })

    await unlock
  })

  // TODO: missing test change Contract config!

})

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
      args: [4],
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
  let minDeposit = 25000
  let maxRelayers = 4

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

  const update = async (name, newname, owner) => RelayerRegistration.methods.update(
    name,
    newname,
    registrationPayload.makerFee,
    registrationPayload.takerFee,
    registrationPayload.fromTokens,
    registrationPayload.toTokens,
  ).send({ from: owner }).then(r => ({
    status: true,
    details: r.events.UpdateEvent.returnValues,
  })).catch(r => ({
    status: false,
    details: r
  }))

  const depositMore = async (relayerName, theOwner, amount) => RelayerRegistration.methods.depositMore(relayerName).send({
    from: theOwner,
    value: toWei(amount),
  }).then(r => ({
    status: true,
    details: r.events.UpdateEvent.returnValues,
  })).catch(err => ({
    status: false,
    details: err,
  }))

  const withdraw = async (relayerName, theOwner, requestAmount) => RelayerRegistration.methods.withdraw(
    relayerName,
    toWei(requestAmount),
  ).send({ from: theOwner }).then(r => ({
    status: true,
    details: r.events.UpdateEvent.returnValues,
  })).catch(err => ({
    status: false,
    details: err,
  }))

  const getRelayerNames = async owner => RelayerRegistration
    .methods.getRelayerNames()
    .call({ from: owner })
    .then(r => r.filter(e => e !== ''))

  const changeOwnership = async (name, newowner, newcoinbase, owner) => RelayerRegistration
    .methods.changeOwnership(name, newowner, newcoinbase)
    .send({ from: owner }).then(success => ({
      status: true,
      details: success.events.ChangeOwnershipEvent.returnValues,
    })).catch(err => ({
      status: false,
      details: err,
    }))

  const relayerMetaView = async (name, owner) => RelayerRegistration
    .methods.relayerMetaView(name)
    .call({ from: owner })
    .then(r => r)
    .catch(() => false)

  const resign = async (name, owner) => RelayerRegistration
    .methods.resign(name)
    .send({ from: owner, gas: '1000000' })
    .then(resp => ({ status: true, details: resp.events.ResignEvent.returnValues }))
    .catch(err => ({ status: false, details: err }))

  beforeEach(async () => {
    response = undefined
    minDeposit = 25000

    registrationPayload = {
      coinbase: accounts[0],
      name: 'TomoAlphaRelayer',
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
  it('CONTRACT CONFIGURATIONS: Min_deposit = 25,000 TOMO; Max_relayer = 4 (for testing purpose)', async () => {
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

    // Relayer name length must be from 3 ~ 32 chars
    response = await register(minDeposit, applicant, { name: 'AB' })
    expect(response.status).to.be.false
    response = await register(minDeposit, applicant, { name: new Array(33).fill('A').join('') })
    expect(response.status).to.be.false

    // Fee must be valid (1 ~ 999)
    response = await register(minDeposit, applicant, { takerFee: 0 })
    expect(response.status).to.be.false
    response = await register(minDeposit, applicant, { makerFee: 1000 })
    expect(response.status).to.be.false

    // Token pairs must match in length
    response = await register(minDeposit, applicant, { fromTokens: [ TokenOne.options.address ] })
    expect(response.status).to.be.false

    // Finally, succeed with a valid payload
    response = await register(minDeposit, applicant)
    expect(response.status).to.be.true
  })


  it('UPDATE: should conform to regulations', async () => {
    const owner = accounts[1]
    let request = await update('TomoAlphaRelayer', 'Tomo-BETA-Relayer', owner)
    expect(request.status).to.be.true

    request = await getRelayerNames(owner)
    expect(request.length).to.equal(1)
    expect(request[0]).to.equal('Tomo-BETA-Relayer')

    request = await relayerMetaView('TomoAlphaRelayer', owner)
    expect(request).to.be.false

    request = await depositMore('TomoAlphaRelayer', owner, 100)
    expect(request.status).to.be.false

    request = await withdraw('TomoAlphaRelayer', owner, 100)
    expect(request.status).to.be.false

    request = await changeOwnership('TomoAlphaRelayer', accounts[2], accounts[2], owner)
    expect(request.status).to.be.false

    request = await resign('TomoAlphaRelayer', owner)
    expect(request.status).to.be.false

    request = await relayerMetaView('Tomo-BETA-Relayer', owner)
    expect(request._coinbase).to.be.equal(accounts[0])
    expect(request._fromTokens.length).to.be.equal(3)

    // Change back to the original name for later tests
    request = await update('Tomo-BETA-Relayer', 'TomoAlphaRelayer', owner)
    expect(request.status).to.be.true

    // The other name should be now available for registration
    request = await register(minDeposit, owner, { name: 'Tomo-BETA-Relayer', coinbase: accounts[7] })
    expect(request.status).to.be.true
  })


  it('Duplicated Owner is OK, Duplicated Coinbase/RelayerName/UUID is Forbidden', async () => {
    const applicant = accounts[2]

    const originalValues = { coinbase: accounts[3], name: '1st-Relayer' }
    const differentValues = { coinbase: accounts[4], name: '2nd-Relayer' }

    response = await register(minDeposit, applicant, originalValues)
    expect(response.status).to.be.true

    response = await register(minDeposit, applicant, { ...differentValues, coinbase: originalValues.coinbase })
    expect(response.status).to.be.false

    response = await register(minDeposit, applicant, { ...differentValues, name: originalValues.name })
    expect(response.status).to.be.false

    response = await register(minDeposit, applicant, differentValues)
    expect(response.status).to.be.true

    // Confirm that owner does own 2 Relayers
    response = await getRelayerNames(applicant)
    expect(response.length).to.equal(2)
  })


  it('COUNTING: count number of relayers, not allow registration if over maximum_relayers', async () => {
    // Through all the previous Tests, 3 RELAYERS have been created!
    const count = await RelayerRegistration.methods.RelayerCount().call()
    expect(count).to.equal('4')

    // Cant register more than 4 relayer...
    const request = await register(minDeposit, accounts[0], { name: 'Tomo-OMEGA-Relayer', coinbase: accounts[8] })
    expect(request.status).to.be.false
  })


  it('DEPOSIT: no zero-deposit, authorized-only', async () => {
    const owner = accounts[2]
    const relayer = '1st-Relayer'

    const otherOwner = accounts[1]
    const otherRelayer = 'TomoAlphaRelayer'

    const nonExistentRelayer = 'Non-existent'

    // Non ZERO value deposit denial
    response = await depositMore(relayer, owner, 0)
    expect(response.status).to.be.false

    // Owner & RelayerName must match!
    response = await depositMore(otherRelayer, owner, 500)
    expect(response.status).to.be.false
    response = await depositMore(relayer, otherOwner, 500)
    expect(response.status).to.be.false
    response = await depositMore(nonExistentRelayer, owner, 500)
    expect(response.status).to.be.false

    // Should succeed
    response = await depositMore(relayer, owner, 500)
    expect(response.details.deposit).to.equal(toWei(25500))
  })


  it('WITHDRAW: authorized-only, valid-value, denied if relayer is resigning', async () => {
    const owner = accounts[2]
    const relayer = '1st-Relayer'

    // Relayer Owner only!
    response = await withdraw(relayer, accounts[1], 500)
    expect(response.status).to.be.false

    // Deposit must remain sufficient
    response = await withdraw(relayer, owner, 501)
    expect(response.status).to.be.false

    // Should succeed!
    response = await withdraw(relayer, owner, 500)
    expect(response.status).to.be.true
    expect(response.details.deposit).to.equal(toWei(25000))

    // NOTE: special case - cannot withdraw from a resigning Relayer
    // Check below test case
  })


  it('CHANGE OWNERSHIP: authorized-only, fresh-coinbase, confirming relayer-owned lists before and after change', async () => {
    const owner1 = {
      address: accounts[2],
      relayers: [
        { name: '1st-Relayer', coinbase: accounts[3] },
        { name: '2nd-Relayer', coinbase: accounts[4] },
      ]
    }

    const owner2 = {
      address: accounts[1],
      relayers: [
        { name: 'TomoAlphaRelayer', coinbase: accounts[0] },
        { name: 'Tomo-BETA-Relayer', coinbase: accounts[7] },
      ]
    }

    let owner1relayers = await getRelayerNames(owner1.address)
    expect(owner1relayers.length).to.equal(2)

    let owner2relayers = await getRelayerNames(owner2.address)
    expect(owner2relayers.length).to.equal(2)

    // Must be the owner of the relayer
    response = await changeOwnership(owner1.relayers[0].name, owner2.address, accounts[5], owner2.address)
    expect(response.status).to.be.false

    // Change to a used-coinbase should fail!
    response = await changeOwnership(owner1.relayers[0].name, owner2.address, accounts[0], owner1.address)
    expect(response.status).to.be.false

    // Change coinbase by calling changeOwnership can be accepted
    response = await changeOwnership(owner1.relayers[0].name, owner1.address, accounts[6], owner1.address)
    expect(response.status).to.be.true
    owner1relayers = await getRelayerNames(owner1.address)
    expect(owner1relayers.length).to.equal(2)
    let relayerDetails = await relayerMetaView(owner1.relayers[0].name, owner1.address)
    expect(relayerDetails._coinbase).to.equal(accounts[6])

    // Transfer the first relayer from owner2 to onwer1
    response = await changeOwnership(owner2.relayers[0].name, owner1.address, accounts[5], owner2.address)
    expect(response.status).to.be.true

    owner1relayers = await getRelayerNames(owner1.address)
    expect(owner1relayers.length).to.equal(3)

    owner2relayers = await getRelayerNames(owner2.address)
    expect(owner2relayers.length).to.equal(1)

    // Owner 2 attempting to view/withdraw from the already-transfered Relayer should fail!
    let request = await relayerMetaView(owner2.relayers[0].name, owner2.address)
    expect(request).to.be.false
    request = await withdraw(owner2.relayers[0].name, owner2.address, 10)
    expect(request.status).to.be.false

    // NOTE: Deposit 5000 TOMO to owner1's Relayer[0] and...
    // Transfer back one relayer from owner1 to owner2 for next test case
    response = await depositMore(owner1.relayers[0].name, owner1.address, 5000)
    expect(response.status).to.be.true
    response = await changeOwnership(owner1.relayers[0].name, owner2.address, accounts[3], owner1.address)
    expect(response.status).to.be.true

    // NOTE: special case - cannot transfer a resigning Relayer
    // Check below test case
  })


  it('RESIGN: process properly, unlock after designated time, clear all traces of resigned relayer', async () => {
    const acc1 = accounts[1]
    const acc2 = accounts[2]

    const rl1Names = await getRelayerNames(acc1)
    const rl2Names = await getRelayerNames(acc2)

    const rl1 = await Promise.all(rl1Names.map(async relayerName => relayerMetaView(relayerName, acc1)))
    const rl2 = await Promise.all(rl2Names.map(async relayerName => relayerMetaView(relayerName, acc2)))

    const owner1 = {
      address: acc1,
      balance: await web3.eth.getBalance(acc1),
      relayers: rl1,
    }

    const owner2 = {
      address: acc2,
      balance: await web3.eth.getBalance(acc2),
      relayers: rl2,
    }

    expect(owner1.relayers[0]._deposit).to.equal(toWei(25000))

    let request = await resign(rl1Names[0], owner1.address)
    expect(request.status).to.be.true
    expect(request.details.deposit_amount).to.equal(toWei(25000))

    // NOTE: change to 5 seconds for easier testing,
    // Dont forget to modify the waiting time in the contract
    const waitingTimeInSeconds = 5
    // Try to get refund immediately, see how much time left...
    request = await RelayerRegistration.methods.refund(rl1Names[0]).send({ from: owner1.address })
    const returnValues = request.events.RefundEvent.returnValues

    try {
      expect(returnValues.remaining_time).to.equal(waitingTimeInSeconds.toString())
    } catch (e) {
      // In case of delay, the remaining time might be less than 5 seconds
      expect(parseInt(returnValues.remaining_time, 10) < waitingTimeInSeconds).to.be.true
    }

    // Attempting to withdraw during lock-time should fail!
    request = await withdraw(rl1Names[0], owner1.address, 100)
    expect(request.status).to.be.false

    // Attempting to transfer a resgining relayer should fail
    request = await changeOwnership(rl1Names[0], owner2.address, accounts[3], owner1.address)
    expect(request.status).to.be.false

    const unlockFund = new Promise(resolve => {
      setTimeout(async () => {
        request = await RelayerRegistration.methods.refund(rl1Names[0]).send({ from: owner1.address })
        expect(request.events.RefundEvent.returnValues.success).to.be.true
        expect(request.events.RefundEvent.returnValues.deposit_amount).to.equal(toWei(25000))

        const newBalance = await web3.eth.getBalance(owner1.address)
        const balanceRoundUp = Math.ceil(parseFloat(web3.utils.fromWei(newBalance), 2), 0)
        // Original prefunded balance = 60000...
        expect(balanceRoundUp).to.equal(35000)

        // Should leave no trace of the released relayer
        const count = await RelayerRegistration.methods.RelayerCount().call()
        expect(count).to.equal('3')

        request = await getRelayerNames(owner1.address)
        expect(request.length).to.equal(1)

        request = await withdraw(rl1Names[0], owner1.address, 100)
        expect(request.status).to.be.false

        request = await depositMore(rl1Names[0], owner1.address, 100)
        expect(request.status).to.be.false

        request = await changeOwnership(rl1Names[0], owner2.address, accounts[3], owner1.address)
        expect(request.status).to.be.false

        resolve()
      }, 1000 * waitingTimeInSeconds + 1000)
    })

    await unlockFund

  })

})

const path = require('path')
const ethers = require('ethers')

require('dotenv').config({
  path: path.resolve(process.cwd(), '.local.env')
})


const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)

const contractAddress = process.env.CONTRACT_ADDRESS
const abi = [
  "function register (address coinbase, uint16 makerFee, uint16 takerFee, address[] fromTokens, address[] toTokens)",
  "event RegisterEvent(uint256 deposit, uint16 makerFee, uint16 takerFee, address[] fromTokens, address[] toTokens)"
]

const privateKey = process.env.USER_PRIVATE_KEY
const wallet = new ethers.Wallet(privateKey, provider)

const contract = new ethers.Contract(contractAddress, abi, wallet)

const overrides = {
  gasLimit: 1000000,
  value: ethers.utils.parseEther('25000'),
}

const payload = {
  coinbase: process.env.USER_COINBASE,
  makerFee: 1,
  takerFee: 1,
  from: [/* couple of token address here */],
  to: [/* couple of token address here */],
}

const register = async () => {
  contract.on('RegisterEvent', (author, oldValue, newValue, event) => {
    console.log('SUCCESSS........')
    console.log(event)
    console.log(oldValue)
    console.log(newValue)
    console.log(author)
  })

  try {
    const tx = await contract.register(
      payload.coinbase,
      payload.makerFee,
      payload.takerFee,
      payload.from,
      payload.to,
      overrides
    )

    await tx.wait()
  } catch(e) {
    console.log(e)
  }

}

register()

import { ethers } from 'ethers'
import { STANDARD_ERC20_ABI } from './abi'
import { RelayerRegistration } from 'artifacts/contracts'

const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)

export const getBalance = async address => {
  const weiBalance = await provider.getBalance(address)
  const ethBalance = ethers.utils.formatEther(weiBalance, {commify: true, pad: true})
  return ethBalance
}

export const validateAddress = (address, balance) => {
  const validAddressLength = typeof address === 'string' && address.length > 0
  const validBalance = typeof balance === 'string' && balance.length > 0
  return validAddressLength && validBalance
}

export const bigNumberify = num => {
  return ethers.utils.bigNumberify(num)
}

export const ERC20TokenInfo = async tokenAddress => {
  try {
    const tokenContract = new ethers.Contract(tokenAddress, STANDARD_ERC20_ABI, provider)
    const name = await tokenContract.name()
    const symbol = await tokenContract.symbol()
    // const decimals = await tokenContract.decimals()
    const total_supply = await tokenContract.totalSupply().then(BNresult => BNresult.toString(10))
    const tokenInfo = {
      name,
      symbol,
      logo: '',
      address: tokenAddress,
      total_supply,
    }
    return tokenInfo
  } catch (e) {
    return undefined
  }
}

export const validateCoinbase = (address, callback) => {
  try {
    const checksum = ethers.utils.getAddress(address)
    return callback(checksum)
  } catch (e) {
    return callback(false)
  }
}

export const toWei = number => {
  const stringified = number.toString()
  return ethers.utils.parseEther(stringified)
}

export const register = (payload, account, deposit) => RelayerRegistration.methods.register(...Object.values({
  ...payload,
})).send({ from: account, value: toWei(deposit) }).then(resp => {
  return { status: true, details: resp.events.RegisterEvent.returnValues }
}).catch(err => {
  return { status: false, details: err }
})

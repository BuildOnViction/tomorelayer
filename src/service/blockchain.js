/* import Web3 from 'web3'
 *
 * const provider = Web3.givenProvider || process.env.WEB3_PROVIDER_URI
 *
 * export const web3 = new Web3(provider)
 *
 * export const getBalance = async address => {
 *   console.log(web3.currentProvider)
 *   const balance = await web3.eth.getBalance(address)
 *   return web3.utils.fromWei(balance)
 * }
 *
 * export const validateAddress = (address) => {
 *   const isValidAddress = web3.utils.isAddress(address)
 *   return isValidAddress
 * }
 *
 * export const findContract = address => {
 *
 * }
 *
 * export const bigNumberify = num => {
 *   return web3.utils.toWei(num.toString())
 * }
 *
 * export const validateCoinbase = address => {
 *
 * }
 *  */

import { ethers } from 'ethers'
import { STANDARD_ERC20_ABI } from './abi'

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
    const decimals = await tokenContract.decimals()
    const totalSupply = await tokenContract.totalSupply().then(BNresult => BNresult.toString(10))
    const tokenInfo = { name, symbol, decimals, totalSupply }
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

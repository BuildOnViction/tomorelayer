import { ethers } from 'ethers'
import {
  UNLOCK_WALLET_METHODS,
  STANDARD_ERC20_ABI,
} from 'service/constant'
import WalletSigner from 'service/wallet'


const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC)

const RelayerRegistrationContract = (appstore, providerUse = provider) => {
  const ContractMeta = appstore.Contracts.find(c => c.name === 'RelayerRegistration')
  const contract = new ethers.Contract(ContractMeta.address, ContractMeta.abi, providerUse)
  return contract
}

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

export const register = async (relayerContract, walletSigner, payload, config) => {

  const contractWithSigner = new ethers.Contract(relayerContract.address, relayerContract.abi, walletSigner)

  try {
    const tx = await contractWithSigner.register(...payload, config)
    const details = await tx.wait()
    return { status: true, details }
  } catch(e) {
    console.error(e)
    return { status: false, details: 'Unable to carry transaction' }
  }

}

export const updateRelayer = async (data, state) => {

}


export const transferRelayer = async(data, state) => {

}

export const resignRelayer = async (data, state) => {

}

export const refundRelayer = async state => {

}

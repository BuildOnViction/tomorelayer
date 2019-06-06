import { ethers, Wallet, Signer } from 'ethers'
import { bigNumber } from '@vutr/purser-core/utils'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { STANDARD_ERC20_ABI } from './abi'


class WalletSigner extends Signer {
  _w = undefined
  provider = undefined

  constructor(_wallet, _provider) {
    super()
    this._w = _wallet
    this.provider = _provider
  }

  getAddress() {
    return Promise.resolve(this._w.address);
  }

  signMessage(msg) {
    return this._w.signMessage(msg)
  }

  async sendTransaction(tx) {
    tx.gasLimit = bigNumber(tx.gasLimit || 1000000).toWei()
    tx.gasPrice = bigNumber(tx.gasPrice || 10000).toGwei()

    const to = await tx.to
    tx.to = to
    tx.inputData = tx.data
    tx.chainId = this._w.chainId
    delete tx.data

    tx.value = bigNumber(tx.value || 1)
    const hexString = await this._w.sign(tx)
    const resp = await this.provider.sendTransaction(hexString)
    return resp
  }
}

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

export const register = async (payload, store) => {
  let signer = {}
  let providerToUse = provider
  let overrides = {}

  const walletType = store.authStore.user_meta.unlockingMethod
  const isUsingMetaMask = walletType === UNLOCK_WALLET_METHODS.BrowserWallet
  const isUsingHardwareWallet = [UNLOCK_WALLET_METHODS.LedgerWallet, UNLOCK_WALLET_METHODS.TrezorWallet].includes(walletType)

  if (isUsingMetaMask) {
    providerToUse = new ethers.providers.Web3Provider(window.web3.currentProvider)
    const accounts = await providerToUse.listAccounts()
    signer = await providerToUse.getSigner(accounts[0])
    overrides = {
      value: ethers.utils.parseEther(store.RelayerForm.relayer_meta.deposit.toString()),
      gasLimit: ethers.utils.bigNumberify('1000000'),
    }
  }

  if (isUsingHardwareWallet) {
    const wallet = store.authStore.user_meta.wallet
    signer = new WalletSigner(wallet, provider)
    overrides = {
      value: 25000,
    }
  }

  const contract = RelayerRegistrationContract(store, providerToUse)
  const contractWithSigner = contract.connect(signer)

  const {
    coinbase,
    makerFee,
    takerFee,
    fromTokens,
    toTokens,
  } = payload

  const tx = await contractWithSigner.register(
    coinbase,
    makerFee,
    takerFee,
    fromTokens,
    toTokens,
    overrides,
  ).then(r => r).catch(r => r)
  console.log(tx);
  return { status: false, details: tx }

}

export const updateRelayer = async (owner, coinbase, makerFee, takerFee, fromTokens, toTokens, wallet) => {}

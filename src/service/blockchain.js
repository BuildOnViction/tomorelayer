import { ethers, Signer } from 'ethers'
import { bigNumber } from '@vutr/purser-core/utils'
import {
  UNLOCK_WALLET_METHODS,
  STANDARD_ERC20_ABI,
} from 'service/constant'


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

export const TxSignerInit = async (method, wallet, payload) => {
  let signer = {}
  let providerToUse = provider
  let overrides = {}

  const isUsingMetaMask = method === UNLOCK_WALLET_METHODS.BrowserWallet
  const isUsingHardwareWallet = [UNLOCK_WALLET_METHODS.LedgerWallet, UNLOCK_WALLET_METHODS.TrezorWallet].includes(method)
  const isUsingTomoWallet = method === UNLOCK_WALLET_METHODS.TomoWallet

  if (isUsingMetaMask) {
    providerToUse = new ethers.providers.Web3Provider(window.web3.currentProvider)
    const accounts = await providerToUse.listAccounts()
    signer = await providerToUse.getSigner(accounts[0])
    overrides = {
      value: ethers.utils.parseEther(payload.value.toString()),
      gasLimit: ethers.utils.bigNumberify('1000000'),
    }
  }

  if (isUsingHardwareWallet) {
    signer = new WalletSigner(wallet, provider)
    overrides = { value: payload.value }
  }

  if (isUsingTomoWallet) {
    // TODO: handle TomoWallet
    // - making new Dapp for TomoWallet
    // - generating QR Code
  }

  return {
    signer,
    data: payload.data,
    config: overrides,
    provider: providerToUse,
  }
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

export const register = async (payload, state) => {
  const formData = state.RelayerForm.relayer_meta
  const userMeta = state.authStore.user_meta
  const signerPayload = {
    value: formData.deposit,
    data: formData,
  }

  const TxSigner = await TxSignerInit(userMeta.unlockingMethod, userMeta.wallet, signerPayload)
  const contract = RelayerRegistrationContract(state, TxSigner.provider)
  const contractWithSigner = contract.connect(TxSigner.signer)

  const {
    coinbase,
    maker_fee,
    taker_fee,
    from_tokens,
    to_tokens,
  } = TxSigner.data

  const tx = await contractWithSigner.register(
    coinbase,
    maker_fee,
    taker_fee,
    from_tokens,
    to_tokens,
    TxSigner.config,
  )

  if (tx.wait) {
    const details = await tx.wait()
    return { status: true, details }
  } else {
    return { status: false, details: tx }
  }

}

export const updateRelayer = async (payload, state) => {

}

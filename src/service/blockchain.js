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
    const value = payload.value || 0
    overrides = {
      value: ethers.utils.parseEther(value.toString()),
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
    data: payload,
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

export const updateRelayer = async (data, state) => {
  const userMeta = state.authStore.user_meta
  const TxSigner = await TxSignerInit(userMeta.unlockingMethod, userMeta.wallet, { data })
  const contract = RelayerRegistrationContract(state, TxSigner.provider)
  const contractWithSigner = contract.connect(TxSigner.signer)

  const {
    coinbase,
    maker_fee,
    taker_fee,
    from_tokens,
    to_tokens,
  } = TxSigner.data

  const tx = await contractWithSigner.update(
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


export const transferRelayer = async(data, state) => {
  const userMeta = state.authStore.user_meta
  const TxSigner = await TxSignerInit(userMeta.unlockingMethod, userMeta.wallet, { data })
  const contract = RelayerRegistrationContract(state, TxSigner.provider)
  const contractWithSigner = contract.connect(TxSigner.signer)

  const {
    currentCoinbase,
    owner,
    coinbase,
  } = TxSigner.data

  // NOTE: the test contract on testnet is still using old_function_name "changeOwnership"
  // rename if new contract is yet to be deployed.
  const tx = await contractWithSigner.transfer(
    currentCoinbase,
    owner,
    coinbase,
    TxSigner.config,
  )

  if (tx.wait) {
    const details = await tx.wait()
    return { status: true, details }
  } else {
    return { status: false, details: tx }
  }
}

export const resignRelayer = async (data, state) => {
  const userMeta = state.authStore.user_meta

  try {
    const TxSigner = await TxSignerInit(userMeta.unlockingMethod, userMeta.wallet, { data })
    const contract = RelayerRegistrationContract(state, TxSigner.provider)
    const contractWithSigner = contract.connect(TxSigner.signer)

    const {
      coinbase,
    } = TxSigner.data

    const tx = await contractWithSigner.resign(coinbase)
    const details = await tx.wait()
    return { status: true, details }
  } catch (e) {
    return { status: false, details: 'Unable to perform' }
  }
}

export const refundRelayer = async state => {
  const userMeta = state.authStore.user_meta
  const data = {
    coinbase: state.User.activeRelayer.coinbase
  }

  try {
    const TxSigner = await TxSignerInit(userMeta.unlockingMethod, userMeta.wallet, { data })
    const contract = RelayerRegistrationContract(state, TxSigner.provider)
    const contractWithSigner = contract.connect(TxSigner.signer)

    const {
      coinbase,
    } = TxSigner.data

    const tx = await contractWithSigner.refund(coinbase)
    const details = await tx.wait()
    return { status: true, details }
  } catch (e) {
    return { status: false, details: 'Unable to request refund' }
  }
}

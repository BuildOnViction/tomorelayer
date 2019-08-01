import { Signer, utils } from 'ethers'
import { bigNumber } from '@vutr/purser-core/utils'

export default class WalletSigner extends Signer {
  _wallet = undefined
  _provider = undefined

  constructor(wallet, provider) {
    super()
    this._wallet = wallet
    this._provider = provider
  }

  get provider() {
    return this._provider
  }

  getAddress() {
    return Promise.resolve(this._wallet.address)
  }

  async signMessage(message) {
    const str = await this._wallet.signMessage({ message })
    return str
  }

  async sendTransaction(originaltx) {
    const tx = { ...originaltx }
    tx.gasLimit = bigNumber(tx.gasLimit || 1000000)
    tx.gasPrice = bigNumber(tx.gasPrice ? tx.gasPrice.toNumber() : '10000').toGwei()

    const to = await tx.to
    tx.to = to
    tx.inputData = tx.data
    tx.chainId = this._wallet.chainId
    delete tx.data

    const nonce = await this._provider.getTransactionCount(this._wallet.address)
    tx.nonce = nonce

    tx.value = bigNumber(tx.value ? tx.value.toString() : '0')
    const resp = await this._wallet.sign(tx)
    const rawTx = utils.parseTransaction(resp)
    return this._provider.getTransaction(rawTx.hash).then((tx) => {
      if (tx === null) {return undefined}
      return this._provider._wrapTransaction(tx, rawTx.hash)
    })
  }
}

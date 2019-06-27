import { Signer } from 'ethers'
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

  signMessage(msg) {
    return this._wallet.signMessage(msg)
  }

  async sendTransaction(tx) {
    tx.gasLimit = bigNumber(tx.gasLimit || 1000000).toWei()
    tx.gasPrice = bigNumber(tx.gasPrice || 10000).toGwei()

    const to = await tx.to
    tx.to = to
    tx.inputData = tx.data
    tx.chainId = this._wallet.chainId
    delete tx.data

    tx.value = bigNumber(tx.value || 1)
    const hexString = await this._wallet.sign(tx)
    const resp = await this._provider.sendTransaction(hexString)
    return resp
  }
}

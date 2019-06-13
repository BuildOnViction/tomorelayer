import { Signer } from 'ethers'
import { bigNumber } from '@vutr/purser-core/utils'

export default class WalletSigner extends Signer {
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

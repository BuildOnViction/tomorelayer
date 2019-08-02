import { ethers } from 'ethers'

export default class TomoXContract {
  contractWithSigner = undefined
  wallet = undefined

  constructor(walletSigner, contractMeta) {
    if (!walletSigner || !contractMeta) {
      return undefined
    }
    this.contractWithSigner = new ethers.Contract(contractMeta.address, contractMeta.abi, walletSigner)
    this.wallet = walletSigner
    return this
  }

  async tokens() {
    const tokens = await this.contractWithSigner.tokens.call()
    return tokens
  }
}

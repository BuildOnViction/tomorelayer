import { ethers } from 'ethers'

export default class LendingContract {
  contractWithSigner = undefined
  wallet = undefined
  contractOwner = undefined

  constructor(walletSigner, contractMeta) {
    if (!walletSigner || !contractMeta) {
      return undefined
    }
    this.contractWithSigner = new ethers.Contract(contractMeta.address, contractMeta.abi, walletSigner)
    this.wallet = walletSigner
    this.contractOwner = contractMeta.owner
    this.txParams = {
      gasPrice: ethers.utils.hexlify(ethers.utils.bigNumberify(250000000)),
    }

    return this
  }

  async update(payload, config = {}) {
    try {
      const parsedPayload = [payload.coinbase, payload.lending_fee, payload.lending_tokens, payload.terms, payload.collaterals]
      config = { ...config, ...this.txParams }

      const tx = await this.contractWithSigner.update(...parsedPayload, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to update' }
    }
  }
}

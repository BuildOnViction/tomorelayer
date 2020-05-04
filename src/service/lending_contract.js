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
    return this
  }

  async update(payload, config = {}) {
    try {
      const parsedPayload = [payload.coinbase, payload.lending_fee, payload.lending_tokens, payload.terms, payload.collaterals]

      const tx = await this.contractWithSigner.update(...parsedPayload, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to update' }
    }
  }
}

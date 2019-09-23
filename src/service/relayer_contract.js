import { ethers } from 'ethers'

export default class RelayerContract {
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

  async register(payload, config = {}) {
    try {
      const parsedPayload = [payload.coinbase, payload.trade_fee, payload.from_tokens, payload.to_tokens]

      const tx = await this.contractWithSigner.register(...parsedPayload, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to register' }
    }
  }

  async update(payload, config = {}) {
    try {
      const parsedPayload = [payload.coinbase, payload.trade_fee, payload.from_tokens, payload.to_tokens]

      const tx = await this.contractWithSigner.update(...parsedPayload, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to update' }
    }
  }

  async transfer(payload, config = {}) {
    try {
      const parsedPayload = [payload.currentCoinbase, payload.owner, payload.coinbase]

      const tx = await this.contractWithSigner.transfer(...parsedPayload, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to transfer' }
    }
  }

  async resign(payload, config = {}) {
    try {
      const tx = await this.contractWithSigner.resign(payload.coinbase, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to resign' }
    }
  }

  async depositMore(payload, config = {}) {
    try {
      const tx = await this.contractWithSigner.depositMore(payload.coinbase, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to deposit' }
    }
  }

  async refund(payload, config = {}) {
    try {
      const tx = await this.contractWithSigner.refund(payload.coinbase, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to refund' }
    }
  }

  async sell(payload, config = {}) {
    try {
      const tx = await this.contractWithSigner.sell(payload.coinbase, payload.price, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to sell relayer' }
    }
  }

  async cancelSelling(payload, config = {}) {
    try {
      const tx = await this.contractWithSigner.sell(payload.coinbase, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to sell relayer' }
    }
  }

  async buy(payload, config = {}) {
    try {
      const tx = await this.contractWithSigner.sell(payload.coinbase, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to sell relayer' }
    }
  }
}

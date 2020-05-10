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
    this.txParams = {
      gasPrice: ethers.utils.hexlify(ethers.utils.bigNumberify(250000000)),
    }

    return this
  }

  async getRelayerByCoinbase(coinbase) {
    try {
      const result = await this.contractWithSigner.getRelayerByCoinbase(coinbase)
      return result
    } catch (e) {
      console.error(e)
      return undefined
    }
  }

  async register(payload, config = {}) {
    try {
      const parsedPayload = [payload.coinbase, payload.trade_fee, payload.from_tokens, payload.to_tokens]
      config = { ...config, ...this.txParams }

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
      config = { ...config, ...this.txParams }

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
      const parsedPayload = [payload.currentCoinbase, payload.owner]
      config = { ...config, ...this.txParams }

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
      config = { ...config, ...this.txParams }
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
      config = { ...config, ...this.txParams }
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
      config = { ...config, ...this.txParams }
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
      config = { ...config, ...this.txParams }
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
      config = { ...config, ...this.txParams }
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
      config = { ...config, ...this.txParams }
      const tx = await this.contractWithSigner.sell(payload.coinbase, config)
      const details = await tx.wait()
      return { status: true, details }
    } catch (e) {
      console.error(e)
      return { status: false, details: 'Unable to sell relayer' }
    }
  }
}

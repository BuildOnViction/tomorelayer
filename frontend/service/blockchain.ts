import { ethers } from 'ethers'

let web3Instance = null

export const web3Provider = (() => {
  if (web3Instance) return web3Instance
  // FIXME: cannot use a hardcoded RPC
  // const rpc = process.env.RPC
  // const tomoProvider = new Web3.providers.HttpProvider(rpc)
  // web3Instance = new Web3(metaWeb3 ? metaWeb3.currentProvider : tomoProvider)
  const metamask = window.web3 ? window.web3.currentProvider : null
  if (metamask) {
    web3Instance = new ethers.providers.Web3Provider(metamask)
  }
  return web3Instance
})()

export const eth = ethers

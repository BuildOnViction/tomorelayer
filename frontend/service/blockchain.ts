import * as Web3 from 'web3'

let web3Instance = null

export const web3 = (() => {
  if (web3Instance) return web3Instance
  const metaWeb3 = window.web3
  // FIXME: cannot use a hardcoded RPC
  // const rpc = process.env.RPC
  // const tomoProvider = new Web3.providers.HttpProvider(rpc)
  // web3Instance = new Web3(metaWeb3 ? metaWeb3.currentProvider : tomoProvider)
  if (metaWeb3) {
    web3Instance = new Web3(metaWeb3.currentProvider)
  }
  return web3Instance
})()

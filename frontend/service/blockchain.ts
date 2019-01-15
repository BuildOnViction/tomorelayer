import Web3 from 'web3'

let _web3 = null

export const web3 = (() => {
  if (_web3) return _web3
  const metaWeb3 = window['web3']
  // FIXME: cannot use a hardcoded RPC
  // const rpc = process.env.RPC
  // const tomoProvider = new Web3.providers.HttpProvider(rpc)
  // _web3 = new Web3(metaWeb3 ? metaWeb3.currentProvider : tomoProvider)

  _web3 = metaWeb3 ? new Web3(metaWeb3.currentProvider) : null
  return _web3
})()

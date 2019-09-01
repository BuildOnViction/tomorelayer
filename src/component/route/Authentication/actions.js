import {
  MISC,
} from 'service/constant'
import * as http from 'service/backend'
import * as _ from 'service/helper'
import RelayerContractClass from 'service/relayer_contract'
import TomoXContractClass from 'service/tomox_contract'


export const ConfirmLogin = async (state, wallet) => {

  const relayerContract = state.Contracts.find(r => r.name === 'RelayerRegistration')
  const tomoxContract = state.Contracts.find(r => r.name === 'TOMOXListing')

  // AUTHENTICATE WALLET
  const address = await wallet.getAddress()
  const signed = await wallet.signMessage(MISC.AuthMessage)
  const { error } = await http.getAuthenticated(address, signed)

  _.ThrowOn(error, 'Cannot verify wallet identity')

  // CONNECTING CONTRACTS
  const relayerContractInstance = new RelayerContractClass(wallet, relayerContract)
  const tomoxContractInstance = new TomoXContractClass(wallet, tomoxContract)

  // CHERRY-PICK RELAYERS
  const userRelayers = {}
  state.Relayers.filter(r => _.strEqual(r.owner, address)).forEach((r, idx) => {
    userRelayers[r.coinbase] = r
    userRelayers[idx] = r
  })

  return {
    user: {
      ...state.user,
      relayers: userRelayers,
      wallet,
    },
    blk: {
      ...state.blk,
      RelayerContract: relayerContractInstance,
      TomoXContract: tomoxContractInstance,
    },
  }
}

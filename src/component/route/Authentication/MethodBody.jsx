import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid, Container } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { match } from 'service/helper'
import * as blk from 'service/blockchain'
import { $getUnlocked, $confirmAddress } from './actions'
import TomoWalletMethod from './Methods/TomoWallet'
import LedgerWalletMethod from './Methods/LedgerWallet'

const { TomoWallet, TrezorWallet, LedgerWallet, BrowserWallet } = UNLOCK_WALLET_METHODS

const Button = ({ onClick, text }) => (
  <button className="btn btn-unlock" onClick={onClick}>
    {text}
  </button>
)

const MethodBody = ({
  method = TomoWallet,
  address,
  balance,
  unlockingMethod,
  $getUnlocked,
  $confirmAddress,
}) => match({
  [TomoWallet]: () => <TomoWalletMethod />,
  [LedgerWallet]: () => <LedgerWalletMethod />,
  [TrezorWallet]: (
    <Grid className="hardware-wallet-method align-end justify-center mt-3">
      <div className="hardware-wallet-method__path mr-2 text-left">
        <label htmlFor="trezor-path" className="block font-2 text-subtle-light mb-1">
          Trezor HD Derivation path
        </label>
        <input
          name="trezor-path"
          value="m/44'/60'/0'/0"
          className="form-input form-input--disabled"
          disabled
        />
      </div>
      <button className="btn btn-unlock" onClick={$getUnlocked}>
        Unlock Wallet
      </button>
    </Grid>
  ),
  [BrowserWallet]: (
    <div>
      {blk.validateAddress(address, balance) && unlockingMethod === BrowserWallet ? (
         <Container padded>
           <Grid className="justify-space-between">
             <Grid className="justify-start direction-column m-0 mr-1">
               <div>
                 <span className="text-bold mr-1">
                   Address:
                 </span>
                 <span>
                   {address}
                 </span>
               </div>
               <div>
                 <span>
                   <span className="text-bold mr-1">
                     Balance:
                   </span>
                   <span className="text-alert mr-1">
                     {balance}
                   </span>
                 </span>
                 <span className="text-bold">
                   TOMO
                 </span>
               </div>
             </Grid>
             <Button onClick={$confirmAddress} text="Use this Wallet!" />
           </Grid>
         </Container>
      ) : (
         <div>
           <h3>Please install & login Metamask Extension then connect it to Tomochain Mainnet or Testnet.</h3>
           <Button onClick={$getUnlocked} text="Unlock Your Wallet!" />
         </div>
      )}
    </div>
  )
})(method)

const mapProps = state => ({
  method: state.authStore.method,
  address: state.authStore.user_meta.address,
  balance: state.authStore.user_meta.balance,
  unlockingMethod: state.authStore.user_meta.unlockingMethod,
})

export default connect(mapProps, store => ({
  $confirmAddress,
  $getUnlocked: state => $getUnlocked(state, store),
}))(MethodBody)

import React from 'react'
import { Grid } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { match } from 'service/helper'

const renderMethodContent = (
  method = UNLOCK_WALLET_METHODS.TomoWallet,
) => match({
  [UNLOCK_WALLET_METHODS.TomoWallet]: (
    <div className="method-option__title">
      <h3 className="mb-0">TomoWallet</h3>
      <h5 className="text-italic text-subtle-light mt-0">
        (Recommended)
      </h5>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.LedgerWallet]: (
    <div className="method-option__title">
      <h3>Ledger Wallet</h3>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.TrezorWallet]: (
    <div className="method-option__title">
      <h3>Trezor Wallet</h3>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.BrowserWallet]: (
    <div className="method-option__title">
      <h3>MetaMask / TrustWallet / MidasWallet</h3>
    </div>
  ),
})(method)

const MethodSelect = ({ method, changeMethod }) => (
  <div className="col-md-12 mb-1">
    <div className="mb-1 mt-2 font-3 text-left">
      Start by choosing the wallet you would like to unlock
    </div>
    <Grid className="method-select no-wrap m-0 mb-1">
      {Object.values(UNLOCK_WALLET_METHODS).map(med => (
        <div
          className={`method-select__option method-select__option--${med === method && 'active'} pointer`}
          onClick={() => changeMethod(med)}
          key={med}
          >
          {renderMethodContent(med)}
        </div>
      ))}
    </Grid>
    <div className="font-2 text-left">
      Using node at <span className="text-bold text-alert">https://rpc.tomochain.com</span>
    </div>
  </div>
)

export default MethodSelect

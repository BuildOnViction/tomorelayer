import React from 'react'
import { Grid } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { match } from 'service/helper'

const MethodContent = (
  method = UNLOCK_WALLET_METHODS.TomoWallet,
) => match({
  [UNLOCK_WALLET_METHODS.TomoWallet]: (
    <div className="method-option__title">
      <h3>TomoWallet</h3>
      <h4>
        (Recommended)
      </h4>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.LedgerWallet]: (
    <div className="method-option__title">
      <h3>TomoWallet</h3>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.TrezorWallet]: (
    <div className="method-option__title">
      <h3>TomoWallet</h3>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.BrowserWallet]: (
    <div className="method-option__title">
      <h3>MetaMask/TrustWallet</h3>
    </div>
  ),
})(method)

const MethodSelect = ({ method, changeMethod }) => (
  <Grid className="method-select no-wrap mb-2">
    {Object.values(UNLOCK_WALLET_METHODS).map(med => (
      <div
        className={`method-select__option method-select__option--${med === method && 'active'} pointer`}
        onClick={() => changeMethod(med)}
        key={med}
        >
        {MethodContent(med)}
      </div>
    ))}
  </Grid>
)

export default MethodSelect

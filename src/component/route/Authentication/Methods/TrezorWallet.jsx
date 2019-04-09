import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { $getUnlocked } from '../actions'

const TrezorWallet = () => (
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
)

export default connect(null,  { $getUnlocked })(TrezorWallet)

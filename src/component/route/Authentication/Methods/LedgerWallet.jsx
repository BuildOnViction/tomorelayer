import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { $changeLedgerHdPath, $getUnlocked } from '../actions'

const LedgerWalletMethod = ({
  LedgerPath,
  $changeLedgerHdPath,
  $getUnlocked,
}) => (
  <Grid className="hardware-wallet-method align-end justify-center mt-3">
    <div className="hardware-wallet-method__path mr-2 text-left">
      <label htmlFor="ledger-path" className="block font-2 text-subtle-light mb-1">
        Select custom HD Derivation path
      </label>
      <input
        name="ledger-path"
        value={LedgerPath}
        onChange={e => $changeLedgerHdPath(e.target.value)}
        className="form-input"
      />
    </div>
    <button className="btn btn-unlock" onClick={$getUnlocked}>
      Unlock Wallet
    </button>
  </Grid>
)

const mapProps = state => ({
  LedgerPath: state.authStore.user_meta.LedgerPath,
})

const actions = store => ({
  $changeLedgerHdPath,
  $getUnlocked: $getUnlocked(store),
})

export default connect(mapProps, actions)(LedgerWalletMethod)

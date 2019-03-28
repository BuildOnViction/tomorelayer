import React from 'react'
import { connect } from 'redux-zero/react'
import { QRCode } from 'react-qr-svg'
import { Grid } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { match } from 'service/helper'

const UnlockButton = ({ onClick }) => (
  <button className="btn btn-unlock" onClick={onClick}>
    Unlock My Wallet!
  </button>
)

const MethodBody = ({
  method = UNLOCK_WALLET_METHODS.TomoWallet,
  qrcode,
  unlock,
  ledgerHdPath,
  changeLedgerHdPath,
}) => match({
  [UNLOCK_WALLET_METHODS.TomoWallet]: (
    <Grid className="tomowallet-method align-center justify-center">
      <div className="tomowallet-method-content pr-2">
        <h2 className="text-left">
          Scan QR code using TomoWallet to unlock
        </h2>
        <div className="block text-underlined">
          Haven’t installed TomoWallet yet?
        </div>
        <a href="#localhost" className="block text-underlined text-subtle-light">
          Click here
        </a>
      </div>
      <div className="tomowallet-method-qrcode">
        <QRCode
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="Q"
          style={{ width: 180, paddingTop: 20 }}
          value={qrcode}
        />
      </div>
    </Grid>
  ),
  [UNLOCK_WALLET_METHODS.LedgerWallet]: (
    <Grid className="hardware-wallet-method align-end justify-center mt-3">
      <div className="hardware-wallet-method__path mr-2 text-left">
        <label htmlFor="ledger-path" className="block font-2 text-subtle-light mb-1">
          Select custom HD Derivation path
        </label>
        <input
          name="ledger-path"
          value={ledgerHdPath}
          onChange={changeLedgerHdPath}
          className="form-input"
        />
      </div>
      <UnlockButton onClick={unlock} />
    </Grid>
  ),
  [UNLOCK_WALLET_METHODS.TrezorWallet]: (
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
      <UnlockButton onClick={unlock} />
    </Grid>
  ),
  [UNLOCK_WALLET_METHODS.BrowserWallet]: (
    <div>
      <h3>Please install & login Metamask Extension then connect it to Tomochain Mainnet or Testnet.</h3>
      <UnlockButton onClick={unlock} />
    </div>
  ),
})(method)

const mapProps = store => ({
  ledgerHdPath: store.authStore.ledgerHdPath
})

const actions = () => ({
  changeLedgerHdPath: (state, event) => ({
    ...state,
    authStore: {
      ...state.authStore,
      ledgerHdPath: event.target.value
    }
  })
})

export default connect(mapProps, actions)(MethodBody)

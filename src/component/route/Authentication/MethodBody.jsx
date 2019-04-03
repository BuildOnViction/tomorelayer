import React from 'react'
import { connect } from 'redux-zero/react'
import { QRCode } from 'react-qr-svg'
import { Grid, Container } from 'component/utility'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { match } from 'service/helper'
import { $changeLedgerHdPath, $getUnlocked, $confirmAddress } from './actions'
import appstore from 'asset/appstore-logo.png'
import googleplay from 'asset/google-play-logo.png'

const Button = ({ onClick, text }) => (
  <button className="btn btn-unlock" onClick={onClick}>
    {text}
  </button>
)

const UnlockButton = ({ onClick }) => <Button onClick={onClick} text="Unlock Your Wallet" />

const MethodBody = ({
  method = UNLOCK_WALLET_METHODS.TomoWallet,
  address,
  balance,
  TomoWalletQRcode,
  LedgerPath,
  $changeLedgerHdPath,
  $getUnlocked,
  $confirmAddress,
}) => match({
  [UNLOCK_WALLET_METHODS.TomoWallet]: (
    <Grid className="tomowallet-method align-center justify-center">
      <div className="tomowallet-method-content pr-2">
        <h2 className="text-left">
          Scan QR code using TomoWallet to unlock
        </h2>
        <div className="block text-underlined">
          Haven’t installed TomoWallet yet? Download below
        </div>
        <div className="mt-1">
          <a href="https://goo.gl/MvE1GV" className="mr-1">
            <img alt="" src={appstore} height="40" />
          </a>
          <a href="https://goo.gl/4tFQzY" className="">
            <img alt="" src={googleplay} height="40" />
          </a>
        </div>
        <div>

        </div>
      </div>
      <div className="tomowallet-method-qrcode">
        <QRCode
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="Q"
          style={{ width: 180, paddingTop: 20 }}
          value={TomoWalletQRcode}
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
          value={LedgerPath}
          onChange={e => $changeLedgerHdPath(e.target.value)}
          className="form-input"
        />
      </div>
      <UnlockButton onClick={$getUnlocked} />
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
      <UnlockButton onClick={$getUnlocked} />
    </Grid>
  ),
  [UNLOCK_WALLET_METHODS.BrowserWallet]: (
    <div>
      {address === '' ? (
         <div>
           <h3>Please install & login Metamask Extension then connect it to Tomochain Mainnet or Testnet.</h3>
           <Button onClick={$getUnlocked} text="Unlock Your Wallet!" />
         </div>
      ) : (
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
      )}
    </div>
  ),
})(method)

const mapProps = state => ({
  method: state.authStore.method,
  address: state.authStore.user_meta.address,
  balance: state.authStore.user_meta.balance,
  LedgerPath: state.authStore.user_meta.LedgerPath,
  TomoWalletQRcode: state.authStore.user_meta.TomoWalletQRcode,
})

export default connect(mapProps, {
  $changeLedgerHdPath,
  $confirmAddress,
  $getUnlocked,
})(MethodBody)

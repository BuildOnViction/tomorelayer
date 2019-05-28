import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { QRCode } from 'react-qr-svg'
import * as blk from 'service/blockchain'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { Grid } from 'component/utility'
import success_icon from 'asset/success.png'
import appstore from 'asset/appstore-logo.png'
import googleplay from 'asset/google-play-logo.png'
import { $confirmAddress } from '../actions'


const { TomoWallet } = UNLOCK_WALLET_METHODS

const SuccessLogin = ({ address, balance, confirm }) => (
  <Grid className="mt-2 justify-start align-center">
    <img alt="success" src={success_icon} width="60" height="60" className="block p-1" />
    <div className="p-1 font-2 mr-2">
      <div>
        <b>Address: </b>
        <span>{address}</span>
      </div>
      <div>
        <b>Balance: </b>
        <span>{balance} TOMO</span>
      </div>
    </div>
    <button className="btn btn-unlock" onClick={confirm}>
      Use this account!
    </button>
  </Grid>
)

const PendingLogin = ({ qrcode }) => (
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
        style={{ width: 200 }}
        value={qrcode}
      />
    </div>
  </Grid>
)

const TomoWalletMethod = ({
  address,
  balance,
  unlockingMethod,
  TomoWalletQRcode,
  $confirmAddress,
}) => {
  const validTomoWalletAddress = blk.validateAddress(address, balance) && unlockingMethod === TomoWallet
  return validTomoWalletAddress ? (
    <SuccessLogin
      address={address}
      balance={balance}
      confirm={$confirmAddress}
    />
  ) : (
    <PendingLogin
      qrcode={TomoWalletQRcode}
    />
  )
}

const mapProps = state => ({
  address: state.authStore.user_meta.address,
  balance: state.authStore.user_meta.balance,
  unlockingMethod: state.authStore.user_meta.unlockingMethod,
  TomoWalletQRcode: state.authStore.user_meta.TomoWalletQRcode,
})

const actions = {
  $confirmAddress,
}

export default connect(mapProps, actions)(TomoWalletMethod)

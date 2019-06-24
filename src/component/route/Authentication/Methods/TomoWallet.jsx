import React from 'react'
import { QRCode } from 'react-qr-svg'
// import * as blk from 'service/blockchain'
import { Grid } from '@material-ui/core'
// import success_icon from 'asset/success.png'
import appstore from 'asset/appstore-logo.png'
import googleplay from 'asset/google-play-logo.png'


/*
 * const SuccessLogin = ({ address, balance, confirm }) => (
 *   <Grid className="mt-2 justify-start align-center">
 *     <img alt="success" src={success_icon} width="60" height="60" className="block p-1" />
 *     <div className="p-1 font-2 mr-2">
 *       <div>
 *         <b>Address: </b>
 *         <span>{address}</span>
 *       </div>
 *       <div>
 *         <b>Balance: </b>
 *         <span>{balance} TOMO</span>
 *       </div>
 *     </div>
 *     <button className="btn btn-unlock" onClick={confirm}>
 *       Use this account!
 *     </button>
 *   </Grid>
 * ) */

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


export default class TomoWallet extends React.Component {
  render() {
    const {
      qrCode
    } = this.props

    return (
      <PendingLogin qrcode={qrCode} />
    )
  }
}

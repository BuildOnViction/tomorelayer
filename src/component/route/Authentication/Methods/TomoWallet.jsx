import React from 'react'
import { QRCode } from 'react-qr-svg'
// import * as blk from 'service/blockchain'
import {
  Container,
  Grid,
  Typography,
} from '@material-ui/core'
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
  <Container maxWidth="md">
    <Grid container spacing={4} justify="center" alignItems="center" className="p-2">

      <Grid item sm={12} md={7} container justify="center">
        <Typography component="h4">
          Scan QR code using TomoWallet to unlock
        </Typography>
        <Typography component="div" className="mt-1 mb-1">
          Haven’t installed TomoWallet yet? Download below
        </Typography>
        <Grid item container justify="center" spacing={2}>
          <Grid item sm={6} md={4}>
            <a href="https://goo.gl/MvE1GV">
              <img alt="" src={appstore} height="40" />
            </a>
          </Grid>
          <Grid item sm={6} md={4}>
            <a href="https://goo.gl/4tFQzY">
              <img alt="" src={googleplay} height="40" />
            </a>
          </Grid>
        </Grid>
      </Grid>

      <Grid sm={12} md={3} container justify="center" item>
        <QRCode
          bgColor="#FFFFFF"
          fgColor="#000000"
          level="Q"
          style={{ width: 200 }}
          value={qrcode}
        />
      </Grid>

    </Grid>
  </Container>
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

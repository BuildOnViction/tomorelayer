import React from 'react'
import { QRCode } from 'react-qr-svg'
import { UNLOCK_WALLET_METHODS } from 'service/constant'
import { match } from 'service/helper'


const MethodBody = ({
  method = UNLOCK_WALLET_METHODS.TomoWallet,
  attributes = {},
}) => match({
  [UNLOCK_WALLET_METHODS.TomoWallet]: (
    <QRCode
      bgColor="#FFFFFF"
      fgColor="#000000"
      level="Q"
      style={{ width: 200, paddingTop: 20 }}
      value={attributes.qrcode}
    />
  ),
  [UNLOCK_WALLET_METHODS.LedgerWallet]: (
    <div>
      <h2>m/44'/889'/0'/0</h2>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.TrezorWallet]: (
    <div>
      <h2>m/44'/60'/0'/0</h2>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.BrowserWallet]: (
    <div>
      <h2>Please install & login Metamask Extension then connect it to Tomochain Mainnet or Testnet.</h2>
    </div>
  ),
})(method)

export default MethodBody

import { QRCode } from 'react-qr-svg'
import { UNLOCK_WALLET_METHODS } from '@constant'
import { match } from '@helper'


export const MethodBody = ({
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
      <h2>{attributes.hdPath}</h2>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.TrezorWallet]: (
    <div>
      <h2>{attributes.hdPath}</h2>
    </div>
  ),
  [UNLOCK_WALLET_METHODS.BrowserWallet]: (
    <div>
      <h2>MetaMask</h2>
    </div>
  ),
})(method)

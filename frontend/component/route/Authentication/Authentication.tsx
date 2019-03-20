import { connect } from 'redux-zero/react'
import Select from 'react-select'
import { QRCode } from 'react-qr-svg'
import { API, UNLOCK_WALLET_METHODS } from '@constant'
import { Grid } from '@utility'
import { Client } from '@action'
import { MethodBody } from './MethodBody'


const mapProps = store => ({
  method: store.authStore.method,
})

const actions = () => ({
  changeMethod: (state, method) => ({
    authStore: { method }
  })
})

@connect(mapProps, actions)
export class Authentication extends React.Component {
  state = {
    qrcode: '',
  }

  componentDidMount() {
    // TODO: detect agent device
    Client.get(API.fetchQRCode).then(({ qrcode }) => this.setState({ qrcode }))
  }

  handleChange = selected => this.props.changeMethod(selected.value)

  render () {
    const methodSelectOptions = Object.keys(UNLOCK_WALLET_METHODS).map(method => ({
      value: UNLOCK_WALLET_METHODS[method],
      label: method,
    }))

    const selectedOption = methodSelectOptions.find(op => op.value === this.props.method)

    const { method } = this.props
    return (
      <div className="col-md-12">
        <h3>Unlock Your Wallet</h3>
        <div className="col-md-6">
          <Select
            value={selectedOption}
            options={methodSelectOptions}
            onChange={this.handleChange}
          />
        </div>
        <div className="col-md-6">
          {method === UNLOCK_WALLET_METHODS.TomoWallet && (
             <QRCode
               bgColor="#FFFFFF"
               fgColor="#000000"
               level="Q"
               style={{ width: 200, paddingTop: 20 }}
               value={this.state.qrcode}
             />
          )}
        </div>
      </div>
    )
  }
}

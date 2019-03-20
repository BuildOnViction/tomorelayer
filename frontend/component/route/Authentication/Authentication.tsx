import { connect } from 'redux-zero/react'
import Select from 'react-select'
import { API, UNLOCK_WALLET_METHODS } from '@constant'
import { Client } from '@action'
import { match, when, notEqual } from '@helper'
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
  constructor(props) {
    super(props)
    this.state = {
      qrcode: '',
      hdPath: '',
      metamask: '',
    }
    this.authComponent = React.createRef()
  }

  componentDidMount() {
    const isAndroid = navigator.userAgent.match(/Android/i)
    const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    Client.get(API.fetchQRCode + agentQuery).then(data => this.setState({
      qrcode: data.payload.qrcode
    }))
  }

  componentDidUpdate(prevProps) {
    const prevMethod = prevProps.method
    const currentMethod = this.props.method
    const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS
    const HDWalletMethods = [ LedgerWallet, TrezorWallet ]
    const setHDPath = hdPath => this.setState({ hdPath })

    const methodListen = match({
      [TomoWallet]: () => console.log('shit happen'),
      [LedgerWallet]: () => setHDPath("m/44'/889'/0'/0"),
      [TrezorWallet]: () => setHDPath("m/44'/60'/0'/0"),
      [BrowserWallet]: () => console.log(this.state.metamask),
    })

    const shouldUpdateHDPath = notEqual(prevMethod, currentMethod) && HDWalletMethods.includes(currentMethod)
    return when(shouldUpdateHDPath).then(methodListen)(currentMethod)
  }

  handleChange = selected => this.props.changeMethod(selected.value)

  render () {
    const methodSelectOptions = Object.keys(UNLOCK_WALLET_METHODS).map(method => ({
      value: UNLOCK_WALLET_METHODS[method],
      label: method,
    }))

    const selectedOption = methodSelectOptions.find(op => op.value === this.props.method)

    const { method } = this.props
    const { qrcode, hdPath } = this.state

    const methodBodyAttributes = {
      qrcode,
      hdPath,
    }

    return (
      <div className="col-md-12" >
        <h3>Unlock Your Wallet</h3>
        <div className="col-md-6">
          <Select
            value={selectedOption}
            options={methodSelectOptions}
            onChange={this.handleChange}
          />
        </div>
        <div className="col-md-6">
          <MethodBody
            method={selectedOption.value}
            attributes={methodBodyAttributes}
          />
        </div>
      </div>
    )
  }
}

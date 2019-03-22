import { open } from '@colony/purser-ledger'
import { connect } from 'redux-zero/react'
import Select from 'react-select'
import { API, UNLOCK_WALLET_METHODS } from '@constant'
import { Client } from '@action'
import * as _ from '@helper'
import { MethodBody } from './MethodBody'

const mapProps = store => ({
  method: store.authStore.method,
  userAddress: store.authStore.userAddress,
})

const actions = () => ({
  changeMethod: (state, event ) => ({
    authStore: { method: event.value }
  }),
  setUserAddress: (state, userAddress) => ({
    authStore: { userAddress }
  })
})

@connect(mapProps, actions)
export class Authentication extends React.Component {
  state = {
    qrcode: '',
    hdPath: '',
  }

  async componentDidMount() {
    const isAndroid = navigator.userAgent.match(/Android/i)
    const isIOS = navigator.userAgent.match(/iPhone|iPad|iPod/i)
    const agentQuery = (isAndroid || isIOS) ? 'mobile' : 'desktop'
    const data = await Client.get(API.fetchQRCode + agentQuery)
    this.setState({ qrcode: data.payload.qrcode })
  }

  componentDidUpdate(prevProps) {
    // Change Hd path on user input
  }

  unlockWallet = e => {
    e.preventDefault()
    const { when, isEmpty, match, safety_net, notEqual } = _
    const currentMethod = this.props.method
    const { TomoWallet, LedgerWallet, TrezorWallet, BrowserWallet } = UNLOCK_WALLET_METHODS

    const metamaskUnlock = () => match({
      false: () => console.warn('No MetaMask found!'),
      true: async () => {
        const provider = window.web3.currentProvider
        const web3 = new ethers.providers.Web3Provider(provider)
        const [error, addresses] = await safety_net(web3.listAccounts())
        when(error).do(console.warn)('Something\'s wrong with the Network')
        when(isEmpty(addresses)).do(console.warn)('You are not logged in yet')
      }
    })(!!window.web3)

    const unlockByMethod = match({
      [TomoWallet]: void 0,
      [LedgerWallet]: async () => {
        const wallet = await open({ addressCount: 100 })
        console.log(wallet)
      },
      [TrezorWallet]: void 0,
      [BrowserWallet]: metamaskUnlock,
    })

    return unlockByMethod(currentMethod)
  }

  render () {
    const methodSelectOptions = Object.keys(UNLOCK_WALLET_METHODS).map(method => ({
      value: UNLOCK_WALLET_METHODS[method],
      label: method,
    }))

    const selectedOption = methodSelectOptions.find(op => op.value === this.props.method)
    const methodBodyAttributes = _.extract('qrcode', 'hdPath').from(this.state)

    return (
      <div className="col-md-12" >
        <h3>Unlock Your Wallet</h3>
        <div className="col-md-6">
          <Select
            value={selectedOption}
            options={methodSelectOptions}
            onChange={this.props.changeMethod}
          />
        </div>
        <div className="col-md-6">
          <MethodBody
            method={selectedOption.value}
            attributes={methodBodyAttributes}
          />
        </div>
        <a href="#" onClick={this.unlockWallet}>
          Unlock my Wallet!
        </a>
      </div>
    )
  }
}

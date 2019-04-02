import React from 'react'
import { accountChangeHook } from '@colony/purser-metamask';
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import TopBar from './TopBar'
import Header from './Header'
import MethodSelect from './MethodSelect'
import MethodBody from './MethodBody'
import ModalWalletAddressList from './ModalWalletAddressList'
import actions from './actions'

class Authentication extends React.Component {
  componentDidMount() {
    this.props.$getQRCode()
  }

  async componentDidUpdate() {
    await accountChangeHook(this.props.$metamaskAddressChangeHook)
  }

  render () {
    return (
      <React.Fragment>
        <TopBar />
        <Container center className="auth-container">
          <Header />
          <MethodSelect  />
          <div className="col-md-12 method-body">
            <MethodBody />
          </div>
        </Container>
        <ModalWalletAddressList />
      </React.Fragment>
    )
  }
}

const mapProps = state => ({
  method: state.authStore.method,
  address: state.authStore.user_meta.address,
})

export default connect(mapProps, actions)(Authentication)

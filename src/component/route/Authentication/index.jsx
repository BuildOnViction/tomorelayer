import React from 'react'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import TopBar from './TopBar'
import Header from './Header'
import MethodSelect from './MethodSelect'
import MethodBody from './MethodBody'
import AddressModal from './AddressModal'
import { $getQRCode } from './actions'

class Authentication extends React.Component {
  componentDidMount() {
    this.props.$getQRCode()
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
        <AddressModal />
      </React.Fragment>
    )
  }
}

const actions = store => ({
  $getQRCode: $getQRCode(store)
})

export default connect(null, actions)(Authentication)

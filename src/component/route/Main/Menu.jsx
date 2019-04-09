import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { $toggleRelayerFormModal } from './main_actions'
import logo from 'asset/app-logo.png'

const Menu = ({
  address,
  $toggleRelayerFormModal,
}) => (
  <Grid className="main-menu justify-start align-center">
    <div className="col-md-3 col-xs-2 col-xxs-2">
      <img alt="logo" src={logo} height="40" />
    </div>
    <div className="col-md-5 hidden-sm hidden-xs hidden-xxs">
      <input
        name="free-search"
        type="text"
        placeholder="Search..."
        className="form-control col-12"
      />
    </div>
    <div className="col-md-4 text-center">
      <button className="btn" onClick={$toggleRelayerFormModal}>
        Create your relayer
      </button>
    </div>
    <div className="col-12 hidden-md hidden-lg hidden-xxl">
      <input
        name="free-search"
        type="text"
        placeholder="Search..."
        className="form-control col-12"
      />
    </div>
  </Grid>
)

const mapProps = state => ({
  address: state.authStore.user_meta.address
})

const actions = {
  $toggleRelayerFormModal,
}

export default connect(mapProps, actions)(Menu)

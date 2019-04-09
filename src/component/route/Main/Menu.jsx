import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import logo from 'asset/app-logo.png'

const Menu = ({ address }) => (
  <Grid className="main-menu justify-start align-center">
    <div className="col-md-3 col-xs-2 col-xxs-2">
      <img alt="logo" src={logo} height="50" />
    </div>
    <div className="col-md-5 hidden-sm hidden-xs hidden-xxs">
      <input
        name="free-search"
        type="text"
        value=""
        placeholder="Search..."
        className="form-control col-12"
      />
    </div>
    <div className="col-md-4 text-center">
      <button className="btn">
        Create your relayer
      </button>
    </div>
    <div className="col-12 hidden-md hidden-lg hidden-xxl">
      <input
        name="free-search"
        type="text"
        value=""
        placeholder="Search..."
        className="form-control col-12"
      />
    </div>
  </Grid>
)

const mapProps = state => ({
  address: state.authStore.user_meta.address
})

export default connect(mapProps)(Menu)

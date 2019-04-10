import React from 'react'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { TextField, Button } from '@material-ui/core'
import { $toggleRelayerFormModal } from './main_actions'
import logo from 'asset/app-logo.png'

const Menu = ({
  address,
  $toggleRelayerFormModal,
}) => (
  <Grid className="main-menu justify-start align-center border-bottom">
    <div className="col-md-3 col-xs-2 col-xxs-2">
      <img alt="logo" src={logo} height="40" />
    </div>
    <div className="col-md-5 hidden-sm hidden-xs hidden-xxs">
      <TextField
        label="Search"
        margin="dense"
        variant="outlined"
        fullWidth
      />
    </div>
    <div className="col-md-4 text-center">
      <Button onClick={$toggleRelayerFormModal} variant="contained" color="primary">
        Create your relayer
      </Button>

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

import React from 'react'
import { connect } from 'redux-zero/react'
import { TextField, Button, InputAdornment } from '@material-ui/core'
import { $cancelRegistration } from '../main_actions'
import tomo_icon from 'asset/tomo-logo-small.png'

const TomoArdornment = (
  <InputAdornment>
    <img alt="tomo" src={tomo_icon} height="20" />
  </InputAdornment>
)

const Step1 = ({
  address,
  $cancelRegistration,
}) => (
  <form>
    <div className="col-12 relayer-form-step-body--title border-bottom">
      Step 1: Submit Register Information
    </div>
    <div className="col-12 border-bottom pb-1">
      <div className="mb-1">You are required to deposit a minimum 25,000 TOMO.</div>
      <div>This deposit will be locked.</div>
    </div>
    <div className="col-12 pb-1">
      <TextField
        id="outlined-dense"
        label="Deposit"
        margin="dense"
        variant="outlined"
        placeholder="20,000"
        className="pb-1"
        fullWidth
        InputProps={{
          endAdornment: TomoArdornment,
        }}
      />
      <TextField
        id="outlined-dense"
        label="Coinbase Address"
        margin="dense"
        variant="outlined"
        defaultValue={address}
        fullWidth
        disabled
      />
    </div>
    <div className="col-12 text-right">
      <Button size="small" variant="contained" className="mr-1" onClick={$cancelRegistration}>
        Cancel
      </Button>
      <Button size="small" color="primary" variant="contained">
        Confirm
      </Button>
    </div>
  </form>
)

const mapProps = state => ({
  address: state.authStore.user_meta.address
})

export default connect(mapProps, { $cancelRegistration })(Step1)

import React from 'react'
import { TextField, Button, InputAdornment } from '@material-ui/core'
import tomo_icon from 'asset/tomo-logo-small.png'

const TomoArdornment = (
  <InputAdornment>
    <img alt="tomo" src={tomo_icon} height="24" />
  </InputAdornment>
)

const Step1 = () => (
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
        fullWidth
        InputProps={{
          endAdornment: TomoArdornment,
        }}
      />
    </div>
    <div className="col-12 text-right">
      <Button size="small" variant="contained" className="mr-1">
        Cancel
      </Button>
      <Button size="small" color="primary" variant="contained">
        Confirm
      </Button>
    </div>
  </form>
)

export default Step1

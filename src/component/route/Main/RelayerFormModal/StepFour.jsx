import React from 'react'
import { connect } from 'redux-zero/react'
import { Button } from '@material-ui/core'
import { Grid } from 'component/utility'
import { $finalizeRegistration, $cancelRegistration } from '../main_actions'

const RegistrationFormStepFour = props => {
  const {
    name,
    deposit,
    address,
    tradePairs,
    makerFee,
    takerFee,
  } = props
  return (
    <form>
      <div className="col-12 relayer-form-step-body--title border-bottom">
        Step 4: Review
      </div>

      <div className="text-super-dark pb-1">
        <div className="col-12 p-0 mt-1">
          <div className="col-6 pb-0 pl-0">
            Relayer Name:
          </div>
          <div className="col-6 pb-0 pl-0">
            {name}
          </div>
        </div>
        <div className="col-12 p-0">
          <div className="col-6 pb-0 pl-0">
            Deposit:
          </div>
          <div className="col-6 pb-0 pl-0">
            {deposit}
          </div>
        </div>
        <div className="col-12 p-0">
          <div className="col-6 pb-0 pl-0">
            Coinbase Address:
          </div>
          <div className="col-6 pb-0 pl-0 text-ellipsis">
            {address}
          </div>
        </div>
        <div className="col-12 p-0">
          <div className="col-6 pb-0 pl-0">
            Trading Pairs:
          </div>
          <div className="col-6 pb-0 pl-0">
            {tradePairs.join(', ')}
          </div>
        </div>
        <div className="col-12 p-0">
          <div className="col-6 pb-0 pl-0">
            Trading Fees:
          </div>
          <div className="col-6 pb-0 pl-0">
            <span className="mr-1">Maker: <i>{makerFee}%</i></span>
            <span className="mr-1">Taker: <i>{takerFee}%</i></span>
          </div>
        </div>
      </div>

      <Grid className="justify-space-between m-0 pt-5">
        <Button size="small" variant="contained" className="mr-1" onClick={props.$cancelRegistration} type="button">
          Cancel
        </Button>
        <Button size="small" color="primary" variant="contained" type="button" onClick={props.$finalizeRegistration}>
          Finish
        </Button>
      </Grid>
    </form>
  )
}

const mapProps = state => ({
  ...state.RelayerForm.relayer_meta,
  address: state.authStore.user_meta.address,
})

export default connect(mapProps, {
  $cancelRegistration,
  $finalizeRegistration,
})(RegistrationFormStepFour)

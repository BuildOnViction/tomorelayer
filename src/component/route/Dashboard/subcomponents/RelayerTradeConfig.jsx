import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Button, TextField, Typography, InputAdornment } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import { wrappers } from '../form_logics'
import { $submitConfigFormPayload } from '../actions'


const RelayerTradeConfig = ({
  values,
  errors,
  handleChange,
  handleSubmit,
}) => {

  const handleFeeChange = e => {
    e.target.value = e.target.value * 10
    return handleChange(e)
  }

  return (
    <Grid className="col-12 mt-1">
      <Typography variant="h6" className="row mb-1">
        Trading Fee
      </Typography>
      <Container className="row col-12 border-all border-rounded mb-4">
        <div className="col-6 p-2">
          <TextField
            label="Maker Fee (minimum 0.1%)"
            name="maker_fee"
            value={values.maker_fee / 10}
            onChange={handleFeeChange}
            error={errors.maker_fee}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            fullWidth
          />
        </div>
        <div className="col-6 p-2">
          <TextField
            label="Taker Fee (minimum 0.1%)"
            name="taker_fee"
            value={values.taker_fee / 10}
            onChange={handleFeeChange}
            error={errors.taker_fee}
            type="number"
            InputProps={{
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            fullWidth
          />
        </div>
      </Container>
      <Grid className="row justify-end p-1">
        <Button color="primary" variant="contained" type="submit">
          Save
        </Button>
      </Grid>
    </Grid>
  )
}

const storeConnect = connect(undefined, { $submitConfigFormPayload })
const formConnect = wrappers.tradeOptionForm(RelayerTradeConfig)

export default storeConnect(formConnect)

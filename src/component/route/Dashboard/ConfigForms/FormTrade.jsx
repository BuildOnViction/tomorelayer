import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Button,
  Container,
  Grid,
  InputAdornment,
  TextField,
  Typography,
} from '@material-ui/core'
import { wrappers } from '../form_logics'
import { $submitConfigFormPayload } from '../actions'
import TokenPairList from 'component/shared/TokenPairList'
import * as _ from 'service/helper'


const FormTrade = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting,
  resetForm,
  setFieldValue,
  relayer,
}) => {

  const handleFeeChange = e => {
    e.target.value = _.round(e.target.value * 10, 0)
    return handleChange(e)
  }

  const formatValue = v => _.round(v / 10, 1)
  const endAdornment = (<InputAdornment position="start">%</InputAdornment>)

  const feeNotChanged = ['maker_fee', 'taker_fee'].every(k => values[k] === relayer[k])
  const tokenNotChanged = ['from_tokens', 'to_tokens'].every(k => {
    const addrSet = new Set(relayer[k])
    const equalLength = values[k].length === relayer[k].length
    const hasItem = values[k].every(addr => addrSet.has(addr))
    return equalLength && hasItem
  })

  const disableSubmit = feeNotChanged && tokenNotChanged
  const disableForm = relayer.resigning || isSubmitting

  return (
    <Container maxWidth="xl">
      <form onSubmit={handleSubmit}>
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Typography variant="h6" className="row">
              Trading Fee
            </Typography>
          </Grid>
          <Grid item>
            <Box display="flex" alignItems="center" justifyContent="space-between" border={1}>
              <div className="p-2 w_100">
                <TextField
                  label="Maker Fee (min: 0.1%, max: 99.9%)"
                  name="maker_fee"
                  value={formatValue(values.maker_fee)}
                  onChange={handleFeeChange}
                  error={errors.maker_fee}
                  type="number"
                  InputProps={{ endAdornment }}
                  fullWidth
                  disabled={disableForm}
                />
              </div>
              <div className="p-2 w_100">
                <TextField
                  label="Taker Fee (min: 0.1%, max: 99.9%)"
                  name="taker_fee"
                  value={formatValue(values.taker_fee)}
                  onChange={handleFeeChange}
                  error={errors.taker_fee}
                  type="number"
                  InputProps={{ endAdornment }}
                  fullWidth
                  disabled={disableForm}
                />
              </div>
            </Box>
          </Grid>
          <Grid item className="mt-2">
            <Typography variant="h6" className="row">
              Listed Tokens
            </Typography>
          </Grid>
          <Grid item>
            <TokenPairList
              fromTokens={values.from_tokens}
              toTokens={values.to_tokens}
              onChange={setFieldValue}
              disabled={disableForm}
            />
          </Grid>
          <Grid item className="mt-2">
            <Box display="flex" justifyContent="space-between">
              <Button type="button" onClick={resetForm} disabled={disableSubmit || disableForm}>
                Reset
              </Button>
              <Button color="primary" variant="contained" type="submit" disabled={disableSubmit || disableForm}>
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const mapProps = state => ({
  relayer: state.User.activeRelayer
})
const storeConnect = connect(mapProps, { $submitConfigFormPayload })
const formConnect = wrappers.tradeForm(FormTrade)

export default storeConnect(formConnect)

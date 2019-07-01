import React from 'react'
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { wrappers } from './forms'
import TokenPairList from 'component/shared/TokenPairList'
import * as _ from 'service/helper'


const FormTrade = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  relayer,
}) => {

  const setPairsValues = pairs => {
    setFieldValue('from_tokens', pairs.map(p => p.from.address))
    setFieldValue('to_tokens', pairs.map(p => p.to.address))
  }

  const tokenNotChanged = ['from_tokens', 'to_tokens'].every(k => {
    const addrSet = new Set(relayer[k])
    const equalLength = values[k].length === relayer[k].length
    const hasItem = values[k].every(addr => addrSet.has(addr))
    return equalLength && hasItem
  })

  const disableSubmit = false
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
                  id="maker_fee-input"
                  value={values.maker_fee}
                  onChange={handleChange}
                  error={errors.maker_fee}
                  type="number"
                  inputProps={{
                    step: 0.01,
                    max: 99.99,
                    min: 0.01,
                  }}
                  fullWidth
                  disabled={disableForm}
                />
              </div>
              <div className="p-2 w_100">
                <TextField
                  label="Taker Fee (min: 0.1%, max: 99.9%)"
                  name="taker_fee"
                  id="taker_fee-input"
                  value={values.taker_fee}
                  onChange={handleChange}
                  error={errors.taker_fee}
                  type="number"
                  inputProps={{
                    step: 0.01,
                    max: 99.99,
                    min: 0.01,
                  }}
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
              value={values}
              onChange={setPairsValues}
            />
          </Grid>
          <Grid item className="mt-2">
            <Box display="flex" justifyContent="flex-end">
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

export default wrappers.tradeForm(FormTrade)

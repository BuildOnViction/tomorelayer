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
    <Container className="p-4" maxWidth="xl">
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Typography variant="h6" className="row mb-1">
            Trading Fee
          </Typography>
        </Grid>
        <Grid item>
          <Grid container className="border-all border-rounded" spacing={6}>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
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
            </Grid>
            <Grid item lg={6} xl={6} md={6} sm={6} xs={12}>
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
            </Grid>
          </Grid>
        </Grid>
        <Grid item>
          <Box display="flex" justifyContent="flex-end">
            <Button color="primary" variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  )
}

const storeConnect = connect(undefined, { $submitConfigFormPayload })
const formConnect = wrappers.tradeOptionForm(RelayerTradeConfig)

export default storeConnect(formConnect)

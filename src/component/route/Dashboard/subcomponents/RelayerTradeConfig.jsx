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


const RelayerTradeConfig = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  setFieldValue,
}) => {

  const handleFeeChange = e => {
    e.target.value = e.target.value * 10
    return handleChange(e)
  }

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
              <div className="p-2 w_100">
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
            />
          </Grid>
          <Grid item className="mt-2">
            <Box display="flex" justifyContent="flex-end">
              <Button color="primary" variant="contained" type="submit">
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const storeConnect = connect(undefined, { $submitConfigFormPayload })
const formConnect = wrappers.tradeOptionForm(RelayerTradeConfig)

export default storeConnect(formConnect)

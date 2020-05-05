import React from 'react'
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Box,
} from '@material-ui/core'
import { connect } from 'redux-zero/react'
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'
import TokenPairList from 'component/shared/TokenPairList'


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
    let quoteTokens = pairs.map(p => p.to.symbol)
  
    quoteTokens = [...new Set(quoteTokens)]
    let quoteNoTomoPairs = quoteTokens.filter(q => {
      let ps = pairs.filter(p => {
        let b = (q === p.to.symbol && 'TOMO' === p.from.symbol)
        b = b || (q === p.from.symbol && 'TOMO' === p.to.symbol)
        return b
      })
      return !(ps.length > 0) && q !== 'TOMO'
    })

    errors.quoteToken = ''
    if (quoteNoTomoPairs.length > 0) {
      errors.quoteToken = `The TOMO/${quoteNoTomoPairs} or the ${quoteNoTomoPairs}/TOMO pair must be enabled to use any other USDT pair`
    }
  
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid item container direction="column" spacing={8}>
          <Grid item>
            <TextField
              label="Choose Trade Fee (min: 0%, max: 10%)"
              name="trade_fee"
              id="trade_fee-input"
              value={values.trade_fee}
              onChange={handleChange}
              error={errors.trade_fee}
              type="number"
              variant="outlined"              
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                endAdornment: '%',
                inputProps: {
                  step: 0.01,
                  max: 10,
                  min: 0,
                }
              }}
            />
          </Grid>
          <Grid item container direction="column" spacing={1}>
            <Grid item container justify="space-between" alignItems="center">
              <Typography variant="body1" className="m-0">
                Set Spot Pairs
              </Typography>
            </Grid>
            <Grid item>
              <TokenPairList
                value={values}
                onChange={setPairsValues}
                disabled={isSubmitting}
                viewOnly={relayer.resigning}
                dexUrl={relayer.link}
              />
            </Grid>
            <Grid item>
              <Box component="span" display="block">
                <i className="text-alert">{ errors.quoteToken }</i>
              </Box>
            </Grid>
          </Grid>
          <Grid item container justify="center">
            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting || !!errors.quoteToken} data-testid="save-button">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.tradeForm
export default compose(formConnect, storeConnect)(FormTrade)

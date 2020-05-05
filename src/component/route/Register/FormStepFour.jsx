import React from 'react'
import {
  Box,
  Button,
  Typography,
} from '@material-ui/core'
import TokenPairList from 'component/shared/TokenPairList'
import { wrappers } from './forms'

const FormStepFour = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  setFieldValue,
  goBack,
}) => {

  const setPairsValues = pairs => {
    document.__memoizedUserSelectedPairs__ = pairs
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
    <form onSubmit={handleSubmit}>
      <Typography variant="h5">
        Select trading pairs
      </Typography>
      <Box className="mb-3">
        Select a token in list A to match with tokens in list B to make the trading pair
      </Box>
      <TokenPairList
        value={values}
        onChange={setPairsValues}
        error={errors.quoteToken}
      />
      <Box component="span" display="block">
        <i className="text-alert">{ errors.quoteToken }</i>
      </Box>
      <Box display="flex" justifyContent="space-between" className="mt-2">
        <Button color="secondary" variant="contained" onClick={goBack} type="button">
          Back
        </Button>
        <Button color="primary" variant="contained" type="submit" disabled={!!errors.quoteToken}>
          Save & Preview
        </Button>
      </Box>
    </form>
  )
}

export default wrappers.tokenPairForm(FormStepFour)

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
  }

  return (
    <form onSubmit={handleSubmit}>
      <Typography variant="h5" className="mb-2">
        Select trading pairs
      </Typography>
      <TokenPairList
        value={values}
        onChange={setPairsValues}
      />
      <Box display="flex" justifyContent="space-between" className="mt-2">
        <Button color="secondary" variant="contained" onClick={goBack} type="button">
          Back
        </Button>
        <Button color="primary" variant="contained" type="submit">
          Confirm
        </Button>
      </Box>
    </form>
  )
}

export default wrappers.tokenPairForm(FormStepFour)

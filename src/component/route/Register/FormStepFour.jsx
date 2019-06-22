import React from 'react'
import {
  Box,
  Button,
  Container,
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

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <Box textAlign="center" className="mb-3">
          <Typography component="h1">
            Choose Trading Pairs of Token
          </Typography>
        </Box>
        <Container maxWidth="md">
          <TokenPairList
            fromTokens={values.fromTokens}
            toTokens={values.toTokens}
            onChange={setFieldValue}
          />
          <Box display="flex" justifyContent="space-between" className="mt-2">
            <Button variant="outlined" className="mr-1" onClick={goBack} type="button">
              Back
            </Button>
            <Button color="primary" variant="contained" type="submit">
              Confirm
            </Button>
          </Box>
        </Container>
      </form>
    </div>
  )
}

export default wrappers.tokenPairForm(FormStepFour)

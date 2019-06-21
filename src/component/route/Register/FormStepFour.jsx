import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Button,
  Container,
  Typography,
} from '@material-ui/core'
import {
  $backOneStep,
  $submitFormPayload,
} from './actions'
import TokenPairList from 'component/shared/TokenPairList'
import { wrappers } from './forms'


const FormStepFour = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  setFieldValue,
  ...props
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
            fromTokens={values.from_tokens}
            toTokens={values.to_tokens}
            onChange={setFieldValue}
            addressOnly={false}
          />
          <Box display="flex" justifyContent="space-between" className="mt-2">
            <Button variant="outlined" className="mr-1" onClick={props.$backOneStep} type="button">
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

const mapProps = state => ({
  relayer_meta: state.RelayerForm.relayer_meta,
})

const actions = {
  $submitFormPayload,
  $backOneStep,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.tokenPairForm(FormStepFour)

export default storeConnect(formConnect)

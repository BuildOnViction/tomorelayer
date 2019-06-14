import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Container, Box } from '@material-ui/core'
import ProgressBar from './ProgressBar'
import FormStepOne from './FormStepOne'
import FormStepTwo from './FormStepTwo'
import FormStepThree from './FormStepThree'
import FormStepFour from './FormStepFour'
import Review from './Review'
import SuccessRegistration from './SuccessRegistration'
import { $resetFormState } from './actions'


class Register extends React.Component {

  componentWillUnmount() {
    this.props.$resetFormState()
  }

  render() {
    const { step } = this.props
    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" flexDirection="column">
          {step < 5 && (<ProgressBar />)}
          <div className="mt-2">
            {step === 1 && <FormStepOne />}
            {step === 2 && <FormStepTwo />}
            {step === 3 && <FormStepThree />}
            {step === 4 && <FormStepFour />}
            {step === 5 && <Review />}
            {step === 6 && <SuccessRegistration />}
          </div>
        </Box>
      </Container>
    )
  }
}

const mapProps = store => ({
  step: store.RelayerForm.step
})

const actions = {
  $resetFormState,
}

const storeConnect = connect(mapProps, actions)

export default storeConnect(Register)

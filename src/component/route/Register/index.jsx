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
import { MISC } from 'service/constant'


export class Register extends React.Component {
  state = {
    step: 1,
    payload: {
      deposit: MISC.MinimumDeposit,
      coinbase: '',
    }
  }

  handleSubmit = values => this.setState({
    step: this.state.step + 1,
    payload: {
      ...this.state.payload,
      ...values,
    }
  })

  render() {
    const {
      step,
      payload,
    } = this.state

    const {
      userAddress,
      usedCoinbases,
    } = this.props

    return (
      <Container maxWidth="md">
        <Box display="flex" justifyContent="center" flexDirection="column">
          {step < 5 && (<ProgressBar step={step} />)}
          <div className="mt-2">
            {step === 1 && (
              <FormStepOne
                {...payload}
                submitPayload={this.handleSubmit}
                userAddress={userAddress}
                usedCoinbases={usedCoinbases}
              />
            )}
            {step === 2 && <FormStepTwo {...payload}/>}
            {step === 3 && <FormStepThree {...payload} />}
            {step === 4 && <FormStepFour {...payload} />}
            {step === 5 && <Review {...payload} />}
            {step === 6 && <SuccessRegistration />}
          </div>
        </Box>
      </Container>
    )
  }
}

const mapProps = state => ({
  userAddress: state.authStore.user_meta.address,
  usedCoinbases: state.Relayers.map(t => t.coinbase),
})

const storeConnect = connect(mapProps)

export default storeConnect(Register)

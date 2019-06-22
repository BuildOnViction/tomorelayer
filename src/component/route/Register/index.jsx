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
  constructor(props) {
    super(props)
    this.state = {
      step: 1,
      payload: {
        owner: props.userAddress,
        deposit: MISC.MinimumDeposit,
        coinbase: '',
        name: '',
        maker_fee: 0.01,
        taker_fee: 0.01,
        from_tokens: [],
        to_tokens: [],
      }
    }
  }

  handleSubmit = values => this.setState({
    step: this.state.step + 1,
    payload: { ...this.state.payload, ...values }
  })

  goBack = () => this.setState({
    step: this.state.step - 1
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
                userAddress={userAddress}
                usedCoinbases={usedCoinbases}
                submitPayload={this.handleSubmit}
              />
            )}
            {step === 2 && (
              <FormStepTwo
                {...payload}
                goBack={this.goBack}
                submitPayload={this.handleSubmit}
              />
            )}
            {step === 3 && (
              <FormStepThree
                {...payload}
                goBack={this.goBack}
                submitPayload={this.handleSubmit}
              />
            )}
            {step === 4 && (
              <FormStepFour
                {...payload}
                goBack={this.goBack}
                submitPayload={this.handleSubmit}
              />
            )}
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

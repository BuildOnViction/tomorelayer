import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Container, Box } from '@material-ui/core'
import { MISC } from 'service/constant'
import * as blk from 'service/blockchain'
import * as http from 'service/backend'
import { PushAlert, AlertVariant } from 'service/frontend'
import ProgressBar from './ProgressBar'
import FormStepOne from './FormStepOne'
import FormStepTwo from './FormStepTwo'
import FormStepThree from './FormStepThree'
import FormStepFour from './FormStepFour'
import Review from './Review'
import SuccessRegistration from './SuccessRegistration'


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

  confirmRegister = async () => {
    const payload = this.state.payload

    const { status, details } = await blk.register(payload)

    if (!status) {
      // NOTE: technically, this should happen if either...
      // 1. gas too low, or
      // 2. user refused to sign Tx
      return this.props.pushAlert({
        variant: AlertVariant.error,
        message: details,
      })
    }

    const newRelayer = await http.createRelayer(payload)
    this.props.saveNewRelayer(newRelayer)
    this.setState({ step: 6 })
  }

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
            {step === 5 && (
              <Review
                meta={payload}
                goBack={this.goBack}
                registerRelayer={this.confirmRegister}
              />
            )}
            {step === 6 && <SuccessRegistration />}
          </div>
        </Box>
      </Container>
    )
  }
}

const mapProps = state => ({
  userAddress: state.user.address,
  usedCoinbases: state.Relayers.map(t => t.coinbase),
})

const actions = store => ({
  pushAlert: PushAlert,
  saveNewRelayer: (state, relayer) => {
    const Relayers = [ ...state.Relayers, relayer ]
    return { Relayers }
  },
})

const storeConnect = connect(mapProps, actions)

export default storeConnect(Register)

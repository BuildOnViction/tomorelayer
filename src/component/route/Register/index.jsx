import React from 'react'
import { connect } from 'redux-zero/react'
import { Box, Container } from '@material-ui/core'
import { MISC, SITE_MAP } from 'service/constant'
import * as blk from 'service/blockchain'
import * as http from 'service/backend'
import * as _ from 'service/helper'
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
        owner: '',
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

  async componentDidMount() {
    const userAddress = await this.props.wallet.getAddress()
    this.setState({
      payload: {
        ...this.state.payload,
        owner: userAddress,
      }
    })
  }

  handleSubmit = values => this.setState({
    step: this.state.step + 1,
    payload: { ...this.state.payload, ...values }
  })

  goBack = () => this.setState({
    step: this.state.step - 1
  })

  confirmRegister = async () => {
    const payload = {
      ...this.state.payload,
      taker_fee: _.round(this.state.payload.taker_fee * 100, 0),
      maker_fee: _.round(this.state.payload.maker_fee * 100, 0),
    }

    const config = { value: blk.toWei(payload.deposit) }

    const { RelayerContract } = this.props
    const { status, details } = await RelayerContract.register(payload, config)

    if (!status) {
      return this.props.pushAlert({
        variant: AlertVariant.error,
        message: details.error,
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

    const userAddress = payload.owner

    const {
      usedCoinbases,
      usedNames,
    } = this.props

    return (
      <Container maxWidth="sm" className="mb-5 mt-5">
        <Box display="flex" justifyContent="center" flexDirection="column">
          {step < 5 && (<ProgressBar step={step} />)}
          <div className="mt-2">
            {step === 1 && userAddress && (
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
                usedNames={usedNames}
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
            {step === 6 && <SuccessRegistration navigate={`${SITE_MAP.Dashboard}/${payload.coinbase}`} />}
          </div>
        </Box>
      </Container>
    )
  }
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract,
  wallet: state.user.wallet,
  usedCoinbases: state.Relayers.map(t => t.coinbase).concat(state.Relayers.map(t => t.owner)),
  usedNames: state.Relayers.map(t => t.name),
})

const actions = store => ({
  pushAlert: PushAlert,
  saveNewRelayer: (state, relayer) => {
    const Relayers = [ ...state.Relayers, relayer ]
    return { Relayers, shouldUpdateUserRelayers: true }
  },
})

const storeConnect = connect(mapProps, actions)

export default storeConnect(Register)

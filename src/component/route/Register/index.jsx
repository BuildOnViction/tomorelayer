import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Box,
  Container,
  Typography,
} from '@material-ui/core'
import { MISC, SITE_MAP } from 'service/constant'
import * as blk from 'service/blockchain'
import * as http from 'service/backend'
import * as _ from 'service/helper'
import { PushAlert, AlertVariant } from 'service/frontend'
import LoadSpinner from 'component/utility/LoadSpinner'
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
      isRegistering: false,
      step: 1,
      payload: {
        owner: '',
        deposit: MISC.MinimumDeposit,
        coinbase: '',
        name: '',
        trade_fee: 0.01,
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
      trade_fee: _.round(this.state.payload.trade_fee * 100, 0),
    }

    try {
      this.setState({ isRegistering: true })
      const config = { value: blk.toWei(payload.deposit) }

      const { RelayerContract } = this.props
      const { status, details } = await RelayerContract.register(payload, config)

      if (!status) {
        this.setState({ isRegistering: false })
        return this.props.pushAlert({
          variant: AlertVariant.error,
          message: details,
        })
      }

      const newRelayer = await http.createRelayer(payload)

      await this.props.pouch.put({
        ...newRelayer,
        _id: 'relayer' + newRelayer.id.toString(),
        type: 'relayer',
        fuzzy: [
          newRelayer.name,
          newRelayer.owner,
          newRelayer.coinbase,
          newRelayer.address,
        ].join(','),
      })

      this.props.saveNewRelayer(newRelayer)
      this.setState({
        step: 6,
        isRegistering: false,
      })

    } catch (e) {
      this.setState({ isRegistering: false })
    }

  }

  render() {
    const {
      isRegistering,
      step,
      payload,
    } = this.state

    const userAddress = payload.owner

    const {
      usedCoinbases,
      usedNames,
      RelayerContract,
    } = this.props

    if (!RelayerContract) {
      return (
        <Container maxWidth="sm" className="register-container">
          <Box display="flex" justifyContent="center" flexDirection="column">
            <LoadSpinner />
          </Box>
        </Container>
      )
    }

    if (!userAddress || userAddress === '') {
      return (
        <Container maxWidth="sm" className="register-container">
          <Box display="flex" justifyContent="center" flexDirection="column">
            <LoadSpinner />
          </Box>
        </Container>
      )
    }

    if (_.strEqual(RelayerContract.contractOwner, userAddress)) {
      return (
        <Container maxWidth="sm" className="register-container">
          <Box display="flex" justifyContent="center" flexDirection="column">
            <Typography variant="body2" className="text-center">
              Contract Owner cannot create a relayer
            </Typography>
          </Box>
        </Container>
      )
    }

    return (
      <Container maxWidth="sm" className="register-container">
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
                isRegistering={isRegistering}
              />
            )}
            {step === 6 && (
              <SuccessRegistration
                navigate={`${SITE_MAP.Dashboard}/${payload.coinbase}`}
                deposit={payload.deposit}
              />
            )}
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
  pouch: state.pouch,
})

const actions = store => ({
  pushAlert: PushAlert,
  saveNewRelayer: async (state, relayer) => {
    const Relayers = [ ...state.Relayers, relayer ]
    const newIndex = Object.keys(state.user.relayers).length / 2
    const user = {
      ...state.user,
      relayers: {
        ...state.user.relayers,
        [relayer.coinbase]: relayer,
        [newIndex]: relayer,
      },
    }

    const pouch = state.pouch
    await pouch.put({
      ...relayer,
      _id: 'relayer' + relayer.id.toString(),
      type: 'relayer',
      fuzzy: [
        relayer.name,
        relayer.owner,
        relayer.coinbase,
        relayer.address,
      ].join(','),
    })

    return {
      user,
      Relayers,
      shouldUpdateUserRelayers: true,
    }
  },
})

const storeConnect = connect(mapProps, actions)

export default storeConnect(Register)

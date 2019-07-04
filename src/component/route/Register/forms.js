import { withFormik } from 'formik'
import { validateCoinbase, bigNumberify } from 'service/blockchain'
import { MISC } from 'service/constant'
import * as _ from 'service/helper'

const MINIMUM_DEPOSIT = MISC.MinimumDeposit

export const wrappers = {
  depositAndCoinbaseForm: withFormik({
    displayName: 'FormStepOne',
    validateOnChange: false,
    mapPropsToValues: (props) => ({
      deposit: props.deposit,
      coinbase: props.coinbase,
    }),
    validate: (values, props) => {
      const errors = {}
      validateCoinbase(values.coinbase, (isValid) => {
        if (!isValid) {
          errors.coinbase = 'invalid coinbase address'
        }
      })

      if (_.compareString(values.coinbase, props.userAddress)) {
        errors.coinbase = 'coinbase cannot be the same as owner address'
      }

      if (props.usedCoinbases.find((r) => _.compareString(r, values.coinbase))) {
        errors.coinbase = 'coinbase is already used'
      }

      const currentDeposit = bigNumberify(values.deposit)
      const invalidDeposit = currentDeposit.lt(MINIMUM_DEPOSIT)
      if (invalidDeposit) {
        errors.deposit = true
      }

      return errors
    },
    handleSubmit: (values, { props }) => props.submitPayload(values),
  }),

  relayerNameForm: withFormik({
    displayName: 'RelayerRegisterNameForm',
    validateOnChange: false,
    mapPropsToValues: (props) => ({
      name: props.name,
    }),
    validate: (values) => {
      const errors = {}
      if (values.name.length < 3) {
        errors.name = 'Relayer name is too short.'
      }
      if (values.name.length > 200) {
        errors.name = 'Relayer name is too long.'
      }
      return errors
    },
    handleSubmit: (values, { props }) => props.submitPayload(values),
  }),

  marketFeeForm: withFormik({
    displayName: 'RelayerRegisterMarketFeeForm',
    validateOnChange: false,
    validate: (values) => {
      const errors = {}
      Object.keys(values).forEach((feeType) => {
        const fee = parseFloat(values[feeType])
        if (fee > 99.99 || fee < 0.01) {
          errors[feeType] = true
        }
      })
      return errors
    },
    mapPropsToValues: (props) => ({
      maker_fee: props.maker_fee,
      taker_fee: props.taker_fee,
    }),
    handleSubmit: (values, { props }) => props.submitPayload(values),
  }),

  tokenPairForm: withFormik({
    displayName: 'RelayerRegisterTokenPairForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: (props) => ({
      from_tokens: props.from_tokens,
      to_tokens: props.to_tokens,
    }),
    handleSubmit: (values, { props }) => props.submitPayload(values),
  }),
}

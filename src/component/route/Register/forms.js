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

      if (_.strEqual(values.coinbase, props.userAddress)) {
        errors.coinbase = 'coinbase cannot be the same as owner address'
      }

      if (props.usedCoinbases.find(_.strEqual(values.coinbase))) {
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
    validate: (values, props) => {
      const errors = {}
      if (values.name.length < 3) {
        errors.name = 'relayer name is too short.'
      }
      if (values.name.length > 200) {
        errors.name = 'relayer name is too long.'
      }
      if (props.usedNames.find(_.strEqual(values.name))) {
        errors.name = 'relayer name is already used.'
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
      if (values.trade_fee > 99.99 || values.trade_fee < 0.01) {
        errors.trade_fee = true
      }
      return errors
    },
    mapPropsToValues: (props) => ({
      trade_fee: props.trade_fee,
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

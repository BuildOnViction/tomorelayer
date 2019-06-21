import { withFormik } from 'formik'
import { validateCoinbase, bigNumberify } from 'service/blockchain'
import { MISC } from 'service/constant'

const MINIMUM_DEPOSIT = MISC.MinimumDeposit

export const wrappers = {

  depositAndCoinbaseForm: withFormik({
    displayName: 'FormStepOne',
    validateOnChange: false,
    mapPropsToValues: props => ({
      deposit: props.deposit,
      coinbase: props.coinbase,
    }),
    validate: (values, props) => {
      const errors = {}
      validateCoinbase(values.coinbase, isValid => {
        const isSameAsOwner = values.coinbase.toLowerCase() === props.userAddress.toLowerCase()
        const isAlreadyUsed = props.usedCoinbases.includes(values.coinbase.toLowerCase())
        if (!isValid || isSameAsOwner || isAlreadyUsed) errors.coinbase = true
      })
      const currentDeposit = bigNumberify(values.deposit)
      const invalidDeposit = currentDeposit.lt(MINIMUM_DEPOSIT)
      if (invalidDeposit) errors.deposit = true
      return errors
    },
    handleSubmit: (values, { props }) => props.submitPayload(values)
  }),

  relayerNameForm: withFormik({
    displayName: 'RelayerRegisterNameForm',
    validateOnChange: false,
    mapPropsToValues: props => ({
      name: props.name,
    }),
    validate: values => {
      const errors = {}
      if (!values.name || values.name.length < 3) errors.name = true
      return errors
    },
    handleSubmit: (values, { props }) => props.submitPayload(values)
  }),

  marketFeeForm: withFormik({
    displayName: 'RelayerRegisterMarketFeeForm',
    enableReinitialize: true,
    validateOnChange: false,
    validate: values => {
      const errors = {}
      Object.keys(values).forEach(feeType => {
        const fee = values[feeType]
        if (fee > 999 || fee < 1) errors[feeType] = true
      })
      return errors
    },
    mapPropsToValues: props => ({
      maker_fee: props.maker_fee,
      taker_fee: props.taker_fee,
    }),
    handleSubmit: (values, { props }) => props.submitPayload(values)
  }),

  tokenPairForm: withFormik({
    displayName: 'RelayerRegisterTokenPairForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: props => ({
      from_tokens: props.from_tokens,
      to_tokens: props.to_tokens,
    }),
    handleSubmit: (values, { props }) => props.submitPayload(values)
  })

}

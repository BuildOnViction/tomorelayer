import * as validUrl from 'valid-url'
import { withFormik } from 'formik'

export const wrappers = {
  infoForm: withFormik({
    displayName: 'RelayerInfoForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: props => ({
      name: props.relayer.name,
      link: props.relayer.link,
      logo: props.relayer.logo,
    }),

    validate: values => {
      const errors = {}
      const check = (key, func) => {
        if (!func(values[key])) errors[key] = true
      }
      check('name', name => name && name.length < 200)
      check('link', url => !url || validUrl.isUri(url))
      check('logo', url => !url || validUrl.isUri(url))
      return errors
    },

    handleSubmit: (values, meta) => {
      meta.props.$submitConfigFormPayload(values)
      meta.setSubmitting(false)
    },
  }),

  tradeForm: withFormik({
    displayName: 'RelayerTradeOptionForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: props => ({
      maker_fee: props.relayer.maker_fee,
      taker_fee: props.relayer.taker_fee,
      from_tokens: props.relayer.from_tokens,
      to_tokens: props.relayer.to_tokens,
    }),

    validate: values => {
      const errors = {}
      const fees = ['maker_fee', 'taker_fee']

      fees.forEach(k => {
        if (values[k] < 1 || values[k] > 999) errors[k] = true
      })

      return errors
    },

    handleSubmit: async (values, meta) => {
      await meta.props.$submitConfigFormPayload(values)
      meta.setSubmitting(false)
    }
  }),


  transferForm: withFormik({
    displayName: 'RelayerTransferForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: props => ({
      currentCoinbase: props.relayer.coinbase,
      owner: props.relayer.owner,
      coinbase: props.relayer.coinbase,
    }),

    handleSubmit: async (values, meta) => {
      await meta.props.$submitConfigFormPayload(values)
      meta.setSubmitting(false)
      setTimeout(() => meta.props.history.push('/'), 1000)
    }
  }),

  resignForm: withFormik({
    displayName: 'RelayerResignForm',
    enableReinitialize: false,
    validateOnChange: false,
    mapPropsToValues: props => ({
      coinbase: props.relayer.coinbase
    }),

    handleSubmit: async (values, meta) => {
      await meta.props.$submitConfigFormPayload(values)
      meta.setSubmitting(false)
    }
  }),

}

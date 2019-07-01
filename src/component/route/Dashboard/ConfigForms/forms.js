import * as validUrl from 'valid-url'
import { withFormik } from 'formik'
import * as http from 'service/backend'
import * as blk from 'service/blockchain'

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

    handleSubmit: async (values, meta) => {
      const relayer = await http.updateRelayer({ ...values, id: meta.props.relayer.id })
      meta.props.alert({ relayer, message: 'relayer info updated' })
      meta.setSubmitting(false)
    },
  }),

  tradeForm: withFormik({
    displayName: 'RelayerTradeOptionForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: props => ({
      maker_fee: props.relayer.maker_fee / 100,
      taker_fee: props.relayer.taker_fee / 100,
      from_tokens: props.relayer.from_tokens,
      to_tokens: props.relayer.to_tokens,
    }),

    validate: values => {
      const errors = {}
      const fees = ['maker_fee', 'taker_fee']

      fees.forEach(k => {
        if (values[k] < 0.01 || values[k] > 99.99) errors[k] = true
      })

      return errors
    },

    handleSubmit: async (values, meta) => {
      const payload = {
        ...meta.props.relayer,
        ...values,
        maker_fee: values.maker_fee * 100,
        taker_fee: values.taker_fee * 100,
      }

      await blk.updateRelayer(payload)
      const relayer = await http.updateRelayer(payload)
      meta.props.alert({ relayer, message: 'relayer trade options updated' })
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
      await blk.transferRelayer({
        ...values,
        currentCoinbase: meta.props.relayer.coinbase,
      })
      const relayer = await http.updateRelayer({
        owner: values.owner,
        coinbase: values.coinbase,
        id: meta.props.relayer.id,
      })
      meta.props.alert({ relayer, message: 'relayer transfered successfuly' })
      meta.setSubmitting(false)
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
      await meta.props.SubmitConfigFormPayload(values)
      meta.setSubmitting(false)
    }
  }),

}

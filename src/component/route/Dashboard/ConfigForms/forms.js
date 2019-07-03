import * as validUrl from 'valid-url'
import { withFormik } from 'formik'
import { SITE_MAP } from 'service/constant'
import { AlertVariant } from 'service/frontend'
import * as http from 'service/backend'
import { validateCoinbase } from 'service/blockchain'

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
      const check = (key, func, message) => {
        if (!func(values[key])) errors[key] = message
      }
      check('name', name => name && name.length < 200 && name.length >= 3, 'invalid name length')
      check('link', url => !url || validUrl.isUri(url), 'invalid link url')
      check('logo', url => !url || validUrl.isUri(url), 'invalid logo url')
      return errors
    },

    handleSubmit: async (values, meta) => {
      const relayer = await http.updateRelayer({ ...values, id: meta.props.relayer.id })

      if (relayer.error) {
        meta.props.PushAlert({ variant: AlertVariant.error, message: relayer.error})
      } else {
        meta.props.PushAlert({ variant: AlertVariant.success, message: 'relayer info updated' })
        meta.props.UpdateRelayer(relayer)
      }

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

    handleSubmit: async (values, meta) => {
      const payload = {
        ...meta.props.relayer,
        ...values,
        maker_fee: values.maker_fee * 100,
        taker_fee: values.taker_fee * 100,
      }

      const { status, details } = await meta.props.RelayerContract.update(payload)

      if (!status) {
        meta.props.PushAlert({ variant: AlertVariant.error, message: details })
      } else {
        const relayer = await http.updateRelayer(payload)
        meta.props.PushAlert({ variant: AlertVariant.success, message: 'relayer trade options updated' })
        meta.props.UpdateRelayer(relayer)
      }

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

    validate: (values, props) => {
      const errors = {}

      ;['owner', 'coinbase'].forEach(address => validateCoinbase(values[address], isValid => {
        if (!isValid) {
          errors[address] = 'invalid addresss'
        }
      }))

      if (values.owner === props.relayer.owner) {
        errors.owner = 'New owner address must be different than current owner address'
      }
      return errors
    },

    handleSubmit: async (values, meta) => {
      const { status, details } = await meta.props.RelayerContract.transfer(values)

      if (!status) {
        console.error(details)
        meta.props.alert({ message: 'Transfer Error: unable to transfer relayer' })
        meta.setSubmitting(false)
        return undefined
      }

      const relayer = await http.updateRelayer({
        owner: values.owner,
        coinbase: values.coinbase,
        id: meta.props.relayer.id,
      })
      meta.setSubmitting(false)
      meta.props.alert({ relayer, message: 'relayer transfered successfuly' })
      setTimeout(() => meta.props.history.push(SITE_MAP.Dashboard), 200)
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

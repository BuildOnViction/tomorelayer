import * as validUrl from 'valid-url'
import { withFormik } from 'formik'

export const wrappers = {
  basicInfoForm: withFormik({
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

    handleSubmit: (values, { props }) => props.$submitConfigFormPayload(values),
  }),

  tradeOptionForm: withFormik({
    displayName: 'RelayerTradeOptionForm',
    enableReinitialize: true,
    validateOnChange: false,
    mapPropsToValues: props => ({
      maker_fee: props.relayer.maker_fee,
      taker_fee: props.relayer.taker_fee,
      from_tokens: props.relayer.from_tokens,
      to_tokens: props.relayer.to_tokens,
    }),

    handleSubmit: async (values, meta) => {
      await meta.props.$submitConfigFormPayload(values)
      meta.setSubmitting(false)
    }
  })
}

import * as validUrl from 'valid-url'
import { withFormik } from 'formik'
// import { validateCoinbase, bigNumberify } from 'service/blockchain'
// import { MINIMUM_DEPOSIT } from 'service/constant'

export const wrappers = {
  basicInfoForm: withFormik({
    enableReinitialize: true,
    validateOnChange: false,
    validate: values => {
      const errors = {}

      const check = (key, func) => {
        if (!func(values[key])) {
          errors[key] = true
        }
      }

      check('name', name => name && name.length < 200)
      check('link', url => !url || validUrl.isUri(url))
      check('logo', url => !url || validUrl.isUri(url))

      return errors
    },

    handleSubmit: (values, { props }) => {
      props.$submitConfigFormPayload({
        name: values.name,
        link: values.link,
        logo: values.logo,
      })
    },

    displayName: 'RelayerInfoForm',
  })
}

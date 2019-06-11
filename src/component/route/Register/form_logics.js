import { withFormik } from 'formik'
//import * as validUrl from 'valid-url'
// import { validateCoinbase, bigNumberify } from 'service/blockchain'
// import { MINIMUM_DEPOSIT } from 'service/constant'

export const wrappers = {
  marketFeeForm: withFormik({
    displayName: 'RelayerRegisterMarketFeeForm',
    enableReinitialize: true,
    validateOnChange: true,

    mapPropsToValues: props => ({
      makerFee: props.relayer_meta.makerFee,
      takerFee: props.relayer_meta.takerFee,
    }),

    handleSubmit: (values, { props }) => {
      props.$submitFormPayload(values)
    },
  }),

  tokenPairForm: withFormik({
    displayName: 'RelayerRegisterTokenPairForm',
    enableReinitialize: true,
    validateOnChange: false,

    mapPropsToValues: props => ({
      from_tokens: props.relayer_meta.from_tokens,
      to_tokens: props.relayer_meta.to_tokens,
    }),

    handleSubmit: (values, { props }) => {
      props.$submitFormPayload({
        fromTokens: values.from_tokens,
        toTokens: values.to_tokens,
      })
    },
  })


}

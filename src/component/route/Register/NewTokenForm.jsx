import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Avatar, Button, TextField } from '@material-ui/core'
import SaveIcon from '@material-ui/icons/Save'
import { LoadSpinner } from 'component/utility'
import { withFormik } from 'formik'
import * as blk from 'service/blockchain'
import { isDev } from 'service/constant'
import { $addToken } from './actions'


class NewTokenForm extends React.Component {
  state = {
    loading: false,
    tokenMeta: undefined,
    alert: undefined,
  }

  async componentDidUpdate(prevProps) {
    const tokenAddress = this.props.values.address
    const { used_tokens } = this.props

    if (!tokenAddress) return
    if (tokenAddress === prevProps.values.address) return

    this.setState({ loading: true })
    const tokenMeta = await blk.ERC20TokenInfo(tokenAddress)

    const handleResult = () => {
      if (!tokenMeta) {
        const invalidTokenAlert = { loading: false, tokenMeta: undefined, alert: 'Invalid TRC-20 Contract Address' }
        return this.setState(invalidTokenAlert)
      }

      if (used_tokens.includes(tokenAddress.toLowerCase())) {
        const invalidTokenAlert = { loading: false, tokenMeta: undefined, alert: 'This Token is already listed' }
        return this.setState(invalidTokenAlert)
      }

      const tokenKeys = ['name', 'symbol', 'total_supply', 'logo']
      const simulatedInputElm = name => ({ target: { value: tokenMeta[name], name } })
      const manuallySetFormValues = key => this.props.handleChange(simulatedInputElm(key))
      tokenKeys.forEach(manuallySetFormValues)
      return this.setState({ loading: false, tokenMeta: true, alert: undefined })
    }

    return isDev ? setTimeout(handleResult, 2000) : handleResult()
  }

  render() {
    const {
      values,
      handleChange,
      handleSubmit,
      isSubmitting,
    } = this.props

    const {
      loading,
      tokenMeta,
      alert,
    } = this.state

    return (
      <form onSubmit={handleSubmit} className="row">
        <div className="col-12">
          <TextField
            label="TRC-20 Token Contract Address"
            placeholder="Token address..."
            name="address"
            variant="outlined"
            margin="dense"
            error={alert}
            value={values.address || ''}
            onChange={handleChange}
            disabled={loading}
            helperText={alert && <i className="text-alert">* {alert}</i>}
            fullWidth
          />
        </div>
        {tokenMeta && (
          <div className="row">
            <div className="col-8">
              <TextField
                label="Token Name"
                name="name"
                variant="outlined"
                margin="dense"
                value={values.name}
                onChange={handleChange}
                className="mb-1"
                disabled
                fullWidth
              />
              <TextField
                label="Token Symbol"
                name="symbol"
                variant="outlined"
                margin="dense"
                value={values.symbol}
                onChange={handleChange}
                className="mb-1"
                disabled
                fullWidth
              />
              <TextField
                label="Total Supply"
                name="total_supply"
                variant="outlined"
                margin="dense"
                value={values.total_supply}
                onChange={handleChange}
                disabled
                fullWidth
              />
            </div>
            <div className="col-4">
              <TextField
                label="Token Logo"
                name="logo"
                variant="outlined"
                margin="dense"
                value={values.logo}
                onChange={handleChange}
                className="mb-1"
              />
              <Avatar
                alt={values.name}
                src={values.logo}
                className="margin-center"
              />
            </div>
          </div>
        )}
        {(loading || isSubmitting) && (
          <div className="row text-center">
            <LoadSpinner height={50} />
          </div>
        )}
        {!isSubmitting && tokenMeta && (
          <div className="row text-center">
            <Button type="submit" size="small">
              Add this token&nbsp; <SaveIcon />
            </Button>
          </div>
        )}
      </form>

    )
  }
}


const FormikWrapper = withFormik({
  validateOnChange: false,
  mapPropsToValues: () => undefined,
  handleSubmit: (values, { props }) => props.$addToken(values),
  displayName: 'NewTokenForm',
})(NewTokenForm)

const mapProps = state => ({
  used_tokens: state.tradableTokens.map(t => t.address.toLowerCase())
})

const actions = { $addToken }

const storeConnect = connect(mapProps, actions)

export default storeConnect(FormikWrapper)

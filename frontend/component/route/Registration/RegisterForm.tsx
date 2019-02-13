import * as _ from 'rambda'
import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Formik } from 'formik'
import { Alert, FormGroup, InputGroup, NumericInput, Intent, Button } from '@blueprintjs/core'
import { Grid } from '@utility'
import { RELAYER_REGISTRATION } from '@action'
import { SITE_MAP } from '@constant'
import SignupForm from './SignupForm'


class RegisterForm extends React.Component {

  state = {
    alert: null,
    loading: false,
  }

  registerNewRelayer = values => this.props.registerRelayer(
    values,
    ({ error, payload }) => {
      const errorAlert = err => `Error: ${err.message} (${err.detail})`
      const successAlert = obj => `Success: ${JSON.stringify(obj)}`
      const alert = error ? errorAlert(error) : successAlert(payload)
      return this.setState({ alert, loading: false })
    },
  )

  validate = values => {
    // TODO: validate input values
  }

  closeAlert = () => {
    const history = this.props.history
    this.form.setSubmitting(false)
    if (this.state.alert.includes('Error')) this.setState({ alert: null })
    if (this.state.alert.includes('Success')) history.push(SITE_MAP.Relayers)
  }

  render() {
    const { alert } = this.state
    const { address } = this.props
    return (
      <Grid className="direction-column relayer-registration--form">
        <Formik
          initialValues={{ address }}
          validate={this.validate}
          onSubmit={this.registerNewRelayer}
          render={SignupForm}
          ref={el => {this.form = el}}
          loading={this.state.loading}
        />
        <Alert
          canEscapeKeyCancel
          canOutsideClickCancel
          intent={Intent.WARNING}
          confirmButtonText="I got it!"
          isOpen={!!alert}
          onClose={this.closeAlert}
        >
          <Grid className="alert-message">
            <div className="col-12">
              {JSON.stringify(alert)}
            </div>
          </Grid>
        </Alert>
      </Grid>
    )
  }
}

const mapProps = store => ({
  address: store.currentUserAddress,
})

const connector = _.compose(
  withRouter,
  connect(mapProps, RELAYER_REGISTRATION),
)

export default connector(RegisterForm)

import _ from 'rambda'
import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Formik } from 'formik'
import { Alert, FormGroup, InputGroup, NumericInput, Intent, Button } from '@blueprintjs/core'
import { Grid } from '@utility'
import { RelayerRegistration } from '@action'
import { SITE_MAP } from '@constant'

const SignUpForm = props => {
  const {
    isSubmitting,
    handleChange,
    handleSubmit,
  } = props
  return (
    <React.Fragment>
      <FormGroup
        className="col-4"
        helperText="Your Relayer name..."
        label="Relayer Name"
        labelFor="name"
        labelInfo="(required)"
      >
        <InputGroup
          name="name"
          type="text"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup
        className="col-4"
        label="Coinbase Address"
        labelFor="address"
        labelInfo="(required)"
      >
        <InputGroup
          name="address"
          type="text"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup
        className="col-4"
        label="Order Rate"
        labelFor="dex_rate"
        labelInfo="(required)"
      >
        <InputGroup
          name="dex_rate"
          type="number"
          onChange={handleChange}
        />
      </FormGroup>

      <FormGroup
        className="col-4"
        label="Your Relayer Crest"
        labelFor="logo"
        labelInfo="(optional)"
      >
        <InputGroup
          name="logo"
          type="text"
          onChange={handleChange}
        />
      </FormGroup>

      <div className="col-4">
        <Button onClick={handleSubmit} intent={Intent.PRIMARY} large>
          {isSubmitting ? 'Loading' : 'Sign Up'}
        </Button>
      </div>
    </React.Fragment>
  )
}

class RegisterForm extends React.Component {

  registerNewRelayer = (values, actions) => {
    this.props.registerRelayer(values)
  }

  initialValues = {
    address: this.props.address
  }

  validate = values => {
    // TODO: validate input values
  }

  closeAlert = () => {
    const { resetAlert, error, history } = this.props
    resetAlert()
    if (!error) history.push(SITE_MAP.Relayers)
  }

  render() {
    const { alert, error } = this.props
    return (
      <Grid className="direction-column relayer-registration--form">
        <Formik
          initialValues={this.initialValues}
          validate={this.validate}
          onSubmit={this.registerNewRelayer}
          render={SignUpForm}
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
  alert: store.alert,
  error: store.error,
})

const connector = _.compose(
  withRouter,
  connect(mapProps, RelayerRegistration),
)

export default connector(RegisterForm)

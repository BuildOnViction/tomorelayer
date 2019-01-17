import { connect } from 'redux-zero/react'
import { Formik } from 'formik'
import { Alert, FormGroup, InputGroup, NumericInput, Intent, Button } from '@blueprintjs/core'
import { Grid } from '@utility'
import { RelayerRegistration } from '@action'

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
          disabled
        />
      </FormGroup>

      <FormGroup
        className="col-4"
        label="Order Rate"
        labelFor="rate"
        labelInfo="(required)"
      >
        <NumericInput
          name="rate"
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

  render() {
    const { alert, resetAlert } = this.props
    return (
      <Grid className="direction-column relayer-registration--form">
        <Formik
          initialValues={this.initialValues}
          validate={this.validate}
          onSubmit={this.registerNewRelayer}
          render={SignUpForm}
        />
        <Alert
          intent={Intent.WARNING}
          confirmButtonText="I got it!"
          isOpen={alert && alert.for === 'registration-form'}
          onClose={resetAlert}
        >
          <p>
            {JSON.stringify(alert)}
          </p>
        </Alert>
      </Grid>
    )
  }
}

const mapProps = store => ({
  address: store.currentUserAddress,
  alert: store.alert
})

const connector = connect(mapProps, RelayerRegistration)

export default connector(RegisterForm)

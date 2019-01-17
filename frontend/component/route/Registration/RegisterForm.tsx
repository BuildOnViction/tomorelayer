import { connect } from 'redux-zero/react'
import { Formik } from 'formik'
import { Grid } from '@utility'
import { FormGroup, InputGroup, NumericInput, Intent, Button } from '@blueprintjs/core'

function SignUpForm(props) {
  const {
    isSubmitting,
    handleChange,
    handleSubmit,
  } = props
  return (
    <Grid className="direction-column relayer-registration--form">
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
    </Grid>
  )
}

class RegisterForm extends React.Component {

  registerNewRelayer = (values, actions) => {
    console.log(values)
  }

  initialValues = {
    address: this.props.address
  }

  validate = values => { }

  render() {
    return (
      <Formik
        initialValues={this.initialValues}
        validate={this.validate}
        onSubmit={this.registerNewRelayer}
        render={SignUpForm}
      />
    )
  }
}

const mapProps = store => ({
  address: store.currentUserAddress,
})

const connector = connect(mapProps)

export default connector(RegisterForm)

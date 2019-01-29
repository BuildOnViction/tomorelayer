import {
    FormGroup,
    InputGroup,
    NumericInput,
    Intent,
    Button,
} from '@blueprintjs/core'

const SignupForm = props => {
  const {
    isSubmitting,
    handleChange,
    handleSubmit,
    values,
    loading,
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
          value={values.address}
          disabled={!!values.address}
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
        label="Foundation_Rate"
        labelFor="foundation_rate"
        labelInfo="(optional)"
      >
        <InputGroup
          name="foundation_rate"
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
          {loading ? 'Loading' : 'Finished'}
        </Button>
      </div>
    </React.Fragment>
  )
}

export default SignupForm

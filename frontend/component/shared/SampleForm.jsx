import React, { PureComponent } from 'react'
import Select from '@atlaskit/select'
import FieldText from '@atlaskit/field-text'
import Button from '@atlaskit/button'
import { Checkbox } from '@atlaskit/checkbox'
import { RadioGroup } from '@atlaskit/radio'
import FieldTextArea from '@atlaskit/field-text-area'

import Form, {
  Field,
  FieldGroup,
  FormHeader,
  FormSection,
  FormFooter,
} from '@atlaskit/form'

const resultBoxStyle = {
  width: '95%',
  height: '300px',
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em',
}

const options = [
  { name: 'color', value: 'red', label: 'Red' },
  { name: 'color', value: 'blue', label: 'Blue' },
  { name: 'color', value: 'yellow', label: 'Yellow' },
  { name: 'color', value: 'green', label: 'Green' },
]

export default class LayoutExample extends PureComponent {
  // Form Event Handlers
  onSubmitHandler = () => {
    console.log('onSubmitHandler')
  }

  onValidateHandler = () => {
    console.log('onValidateHandler')
  }

  onResetHandler = () => {
    console.log('onResetHandler')
  }

  onChangeHandler = () => {
    console.log('onChangeHandler')
  }
  onBlurHandler = () => {
    console.log('onBlurHandler')
  }
  onFocusHandler = () => {
    console.log('onFocusHandler')
  }

  // Footer Button Handlers
  submitClickHandler = () => {
    this.formRef.submit()
  }

  validateClickHandler = () => {
    this.formRef.validate()
  }

  render() {
    return (
      <div
        style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column' }}
      >
        <Form
          name="layout-example"
          onSubmit={this.onSubmitHandler}
          onReset={this.onResetHandler}
          ref={form => {
            this.formRef = form
          }}
          action="//httpbin.org/get"
          method="GET"
          target="submitFrame"
        >
          <FormHeader
            title="Form Header Title"
            description="Form Description"
          />

          <FormSection
            name="section-1"
            title="Form Section"
            description="Section Description"
          >
            <Field label="FieldText" helperText="Helper Text" required>
              <FieldText name="myText" placeholder="a placeholder value" />
            </Field>

            <Field
              label="Select"
              helperText="Helper Text"
              invalidMessage="Field Invalid Message"
              isInvalid
            >
              <Select />
            </Field>

            <Field
              label="Field 1"
              validMessage="Valid Message"
              isInvalid={false}
            >
              <Select />
            </Field>

            <Field
              label="Field 2"
              invalidMessage="Invalid Message"
              validMessage="valid Message"
              isRequired
            >
              <Select />
            </Field>

            <FieldGroup label="Checkboxes">
              <Field>
                <Checkbox
                  label="Checkbox- Valid"
                  value="Valid"
                  onChange={this.onChangeHandler}
                  name="checkbox-valid"
                />
              </Field>
              <Field isInvalid invalidMessage="Invalid Message">
                <Checkbox
                  label="Checkbox - Invalid"
                  value="Invalid"
                  onChange={this.onChangeHandler}
                  name="checkbox-valid"
                />
              </Field>
            </FieldGroup>

            <Field isRequired label="Radio Group">
              <RadioGroup options={options} onChange={this.onChangeHandler} />
            </Field>

            <Field isInvalid invalidMessage="An invalid message example">
              <FieldTextArea label="Is Invalid & showing message" />
            </Field>
          </FormSection>

          <FormFooter
            actionsContent={[
              {
                id: 'submit-button',
              },
              {},
            ]}
          >
            <Button type="submit" appearance="primary">
              Submit
            </Button>
            <Button appearance="subtle" onClick={this.validateClickHandler}>
              Validate
            </Button>
          </FormFooter>
        </Form>

        <p>The data submitted by the form will appear below:</p>
        <iframe
          src=""
          title="Checkbox Resopnse Frame"
          id="submitFrame"
          name="submitFrame"
          style={{ resultBoxStyle }}
        />
      </div>
    )
  }
}

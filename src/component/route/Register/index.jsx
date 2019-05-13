import React from 'react'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import ProgressBar from './ProgressBar'
import FormStepOne from './FormStepOne'


class Register extends React.Component {

  componentDidMount() {
    console.log('hello register');
  }

  render() {
    const { step } = this.props
    return (
      <Container center>
        <ProgressBar />
        <div className="register-form--container">
          {step === 1 && <FormStepOne />}
        </div>
      </Container>
    )
  }
}


const mapProps = store => ({
  step: store.RelayerForm.step
})

export default connect(mapProps)(Register)

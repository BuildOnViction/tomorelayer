import React from 'react'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import ProgressBar from './ProgressBar'
import FormStepOne from './FormStepOne'
import FormStepTwo from './FormStepTwo'
import FormStepThree from './FormStepThree'


class Register extends React.Component {

  componentDidMount() {
    console.log('hello register');
  }

  render() {
    const { step } = this.props
    console.log(step);
    return (
      <Container center>
        <ProgressBar />
        <div className="register-form--container">
          {step === 1 && <FormStepOne />}
          {step === 2 && <FormStepTwo />}
          {step === 3 && <FormStepThree />}
        </div>
      </Container>
    )
  }
}


const mapProps = store => ({
  step: store.RelayerForm.step
})

export default connect(mapProps)(Register)

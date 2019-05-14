import React from 'react'
import cx from 'classnames'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import ProgressBar from './ProgressBar'
import FormStepOne from './FormStepOne'
import FormStepTwo from './FormStepTwo'
import FormStepThree from './FormStepThree'
import FormStepFour from './FormStepFour'


class Register extends React.Component {

  render() {
    const { step } = this.props
    const cls = currentStep => cx('register-form--container', { 'register-form--container__expand': currentStep === 4 })
    return (
      <Container center>
        <ProgressBar />
        <div className={cls(step)}>
          {step === 1 && <FormStepOne />}
          {step === 2 && <FormStepTwo />}
          {step === 3 && <FormStepThree />}
          {step === 4 && <FormStepFour />}
        </div>
      </Container>
    )
  }
}


const mapProps = store => ({
  step: store.RelayerForm.step
})

export default connect(mapProps)(Register)

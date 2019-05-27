import React from 'react'
import cx from 'classnames'
import { connect } from 'redux-zero/react'
import { Container } from 'component/utility'
import ProgressBar from './ProgressBar'
import FormStepOne from './FormStepOne'
import FormStepTwo from './FormStepTwo'
import FormStepThree from './FormStepThree'
import FormStepFour from './FormStepFour'
import Review from './Review'
import SuccessRegistration from './SuccessRegistration'
import { $fetchTokens, $resetFormState } from './actions'


class Register extends React.Component {

  componentDidMount() {
    this.props.$fetchTokens()
  }

  componentWillUnmount() {
    this.props.$resetFormState()
  }

  render() {
    const { step } = this.props
    const cls = currentStep => cx('register-form--container', { 'register-form--container__expand': currentStep === 4 })
    return (
      <Container center>
        {step < 5 && (<ProgressBar />)}
        <div className={cls(step)}>
          {step === 1 && <FormStepOne />}
          {step === 2 && <FormStepTwo />}
          {step === 3 && <FormStepThree />}
          {step === 4 && <FormStepFour />}
          {step === 5 && <Review />}
          {step === 6 && <SuccessRegistration />}
        </div>
      </Container>
    )
  }
}


const mapProps = store => ({
  step: store.RelayerForm.step
})

export default connect(mapProps, { $fetchTokens, $resetFormState })(Register)

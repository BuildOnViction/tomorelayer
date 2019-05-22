import React from 'react'
import { connect } from 'redux-zero/react'
import cx from 'classnames'
import { Grid } from 'component/utility'


const ProgressBar = ({ step }) => {
  const cls = currentStep => cx(
    'register-progress--step',
    {
      'register-progress--step__completed': currentStep < step,
      'register-progress--step__next': currentStep > step,
      'register-progress--step__current': currentStep === step,
    }
  )

  return (
    <Grid className="justify-center row">
      <div className="register-progress--container">
        {[1,2,3,4].map(_step => (
          <div className="col-md-3 text-center" key={_step}>
            <div className={cls(_step)}>
              {_step < step ? (<i className="material-icons">check</i>) : _step}
            </div>
          </div>
        ))}
      </div>
    </Grid>
  )
}

const mapProps = store => ({
  step: store.RelayerForm.step
})
export default connect(mapProps)(ProgressBar)

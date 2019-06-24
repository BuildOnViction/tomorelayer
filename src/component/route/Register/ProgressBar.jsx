import React from 'react'
import cx from 'classnames'
import { Container, Box } from '@material-ui/core'


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
    <Container maxWidth="sm">
      <Box display="flex">
        {[1,2,3,4].map(_step => (
          <div className="col-md-3 text-center" key={_step}>
            <div className={cls(_step)}>
              {_step < step ? (<i className="material-icons">check</i>) : _step}
            </div>
          </div>
        ))}
      </Box>
    </Container>
  )
}

export default ProgressBar

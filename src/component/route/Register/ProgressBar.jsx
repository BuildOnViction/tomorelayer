import React from 'react'
import { Box } from '@material-ui/core'

const FulfilledStep = ({ step }) => (
  <Box>
    <Box className="step_circle step_circle__2">
      <Box className="step_circle step_circle__1">
        <Box className="step_circle step_circle__0">
          {step}
        </Box>
      </Box>
    </Box>
  </Box>
)

const UnfulfilledStep = ({ step }) => (
  <Box className="step_circle step_circle__unfulfilled">
    {step}
  </Box>
)

const ProgressBar = ({ step }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-3">
      {[1,2,3,4].map(_step => step >= _step ? <FulfilledStep key={_step} step={_step} /> : <UnfulfilledStep key={_step} step={_step}/>)}
    </Box>
  )
}

export default ProgressBar

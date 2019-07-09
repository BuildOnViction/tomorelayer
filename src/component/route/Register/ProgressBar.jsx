import React from 'react'
import cx from 'classnames'
import { Box } from '@material-ui/core'

const ProgressStep = ({ step, unfulfilled }) => {
  const classes = (level, bol) => cx(
    'step_circle',
    `step_circle__${level}`,
    {
      unfulfilled: bol,
    }
  )
  return (
    <Box className={classes(2, unfulfilled)}>
      <Box className={classes(1, unfulfilled)}>
        <Box className={classes(0, unfulfilled)}>
          {step}
        </Box>
      </Box>
    </Box>
  )
}

const ProgressBar = ({ step }) => {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center" className="mb-3">
      {[1,2,3,4].map(_step => (
        <React.Fragment key={_step} >
          {step >= _step ? <ProgressStep step={_step} /> : <ProgressStep step={_step} unfulfilled />}
          {_step < 4 && <div className="progress-trailing" />}
        </React.Fragment>
      ))}
    </Box>
  )
}

export default ProgressBar

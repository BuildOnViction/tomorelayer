import React from 'react'
import cx from 'classnames'
import { Icon } from '@material-ui/core'
import { Grid } from 'component/utility'
import { connect } from 'redux-zero/react'

const StepMetaData = [
  'Submit register information',
  'Customize your relayer',
  'Review',
]

const cls = (step, index) => cx(
  'col-12',
  {
    'text-super-light': index > step,
    'text-subtle-light': index < step,
  }
)

const ProgressBar = ({ step }) => (
  <React.Fragment>
    {StepMetaData.map((stepText, index) => (
      <div className={cls(step, index)} key={stepText}>
        <Grid className="m-0 align-center justify-start">
          <div className="text-bold">Step {index + 1}:</div>
          {index < step && (<Icon className="text-green progress-bar--status">check_circle</Icon>)}
        </Grid>
        <div>
          {stepText}
        </div>
      </div>
    ))}
  </React.Fragment>
)

const mapProps = state => ({
  step: state.RelayerForm.step
})

export default connect(mapProps)(ProgressBar)

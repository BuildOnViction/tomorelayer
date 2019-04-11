import React from 'react'
import cx from 'classnames'
import { Icon } from '@material-ui/core'
import { Grid } from 'component/utility'
import { connect } from 'redux-zero/react'
import { $changeStep } from '../main_actions'

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

const progressTextCls = (step, index) => cx(
  'progress-bar--text',
  {
    'prev-step': index < step,
  },
)

const ProgressBar = props => {
  const goBackStep = (step, index) => () => {
    return index < props.step ? props.$changeStep(index) : undefined
  }

  return (
    <React.Fragment>
      {StepMetaData.map((stepText, index) => (
        <div className={cls(props.step, index)} key={stepText}>
          <Grid className="m-0 align-center justify-start">
            <div className="text-bold">Step {index + 1}:</div>
            {index < props.step && (<Icon className="text-green progress-bar--status">check_circle</Icon>)}
          </Grid>
          <a href="#" className={progressTextCls(props.step, index)} onClick={goBackStep(props.step, index)}>
            {stepText}
          </a>
        </div>
      ))}
    </React.Fragment>
  )
}

const mapProps = state => ({
  step: state.RelayerForm.step
})

export default connect(mapProps, { $changeStep })(ProgressBar)

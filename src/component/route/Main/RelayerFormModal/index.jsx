import React from 'react'
import { connect } from 'redux-zero/react'
import { Dialog } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import ProgressBar from './ProgressBar'
import StepOne from './StepOne'
import StepTwo from './StepTwo'
import StepThree from './StepThree'


class RelayerFormModal extends React.Component {

  dialogClasses = {
    paper: 'relayer-form-modal'
  }

  render() {
    const { isOpen, step } = this.props
    return (
      <Dialog open={isOpen} fullWidth maxWidth="sm" classes={this.dialogClasses}>
        <Container className="p-0 relayer-form--container">
          <Grid className="m-0">
            <Grid className="direction-column col-3 relayer-form--progress">
              <ProgressBar />
            </Grid>
            <Grid className="direction-column col-auto relayer-form--step-body">
              {step === 0 && <StepOne />}
              {step === 1 && <StepTwo />}
              {step === 2 && <StepThree />}
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    )
  }
}

const mapProps = ({ toggle, RelayerForm }) => ({
  step: RelayerForm.step,
  isOpen: toggle.RelayerFormModal,
})

export default connect(mapProps)(RelayerFormModal)

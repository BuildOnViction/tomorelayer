import React from 'react'
import { connect } from 'redux-zero/react'
import { Dialog, Radio, Button, IconButton, Icon, Slide } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import ProgressBar from './ProgressBar'
import Step1 from './Step1'
import { $toggleRelayerFormModal } from '../main_actions'


class RelayerFormModal extends React.Component {

  dialogClasses = {
    paper: 'relayer-form-modal'
  }

  render() {
    const {
      address,
      isOpen,
      step,
      $toggleModal,
    } = this.props

    return (
      <Dialog open={isOpen} fullWidth maxWidth="sm" classes={this.dialogClasses}>
        <Container className="p-0 relayer-form--container">
          <Grid className="m-0">
            <Grid className="direction-column col-3 relayer-form--progress">
              <ProgressBar />
            </Grid>
            <Grid className="direction-column col-auto relayer-form--step-body">
              {step === 0 && <Step1 />}
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    )
  }
}

const mapProps = ({ toggle, authStore, RelayerForm }) => ({
  step: RelayerForm.step,
  isOpen: toggle.RelayerFormModal,
  address: authStore.user_meta.address,
})

export default connect(mapProps, {
  $toggleModal: $toggleRelayerFormModal,
})(RelayerFormModal)

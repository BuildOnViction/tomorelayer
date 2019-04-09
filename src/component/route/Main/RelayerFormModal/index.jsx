import React from 'react'
import { connect } from 'redux-zero/react'
import { Dialog, Radio, Button, IconButton, Icon, Slide } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import ProgressBar from './ProgressBar'
import { $toggleRelayerFormModal } from '../main_actions'


class RelayerFormModal extends React.Component {

  dialogClasses = {
    paper: 'relayer-form-container'
  }

  render() {
    const {
      isOpen,
      address,
      $toggleModal,
    } = this.props

    return (
      <Dialog open={isOpen} fullWidth maxWidth="md" classes={this.dialogClasses}>
        <Container>
          <Grid className="direction-column">
            <Grid className="direction-column m-0 col-3">
              <ProgressBar />
            </Grid>
          </Grid>
        </Container>
      </Dialog>
    )
  }
}

const mapProps = ({ toggle, authStore }) => ({
  isOpen: toggle.RelayerFormModal,
  address: authStore.user_meta.address,
})

export default connect(mapProps, {
  $toggleModal: $toggleRelayerFormModal,
})(RelayerFormModal)

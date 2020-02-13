import React from 'react'
import { withRouter } from 'react-router-dom'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { connect } from 'redux-zero/react'
import { compose, isEmpty } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'
import { TransferNotice } from './PresentComponents'


const FormTransfer = props => {
  const {
    handleChange,
    handleSubmit,
    values,
    errors,
    submitForm,
    isSubmitting,
    relayer,
  } = props

  const [step, setStep] = React.useState(0)
  const [open, setOpen] = React.useState(false)

  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const confirmAndClose = () => {
    handleClose()
    submitForm()
  }

  const transferDisabled = isSubmitting || values.owner === relayer.owner || isEmpty(values.owner)

  const nextStep = () => setStep(1)

  if (relayer.resigning) {
    return (
      <Container maxWidth="xl">
        <Grid container>
          <Grid item sm={12} md={8}>
            <Typography variant="h6">
              This relayer has been requested to resign.
            </Typography>
            <Typography variant="h6">
              Transferring relayer is not allowed.
            </Typography>
          </Grid>
        </Grid>
      </Container>
    )
  }

  return (
    <Container>
      {step === 0 && <TransferNotice confirm={nextStep} />}
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <Grid item container direction="column" spacing={4}>
            <Grid item>
              <Typography variant="h5">
                Transfer Relayer
              </Typography>
            </Grid>
            <Grid item>
              Which owner address would you like to transfer to?
            </Grid>
            <Grid item container direction="column" spacing={2}>
              <Grid item>
                <TextField
                  label="New Owner"
                  value={values.owner}
                  onChange={handleChange}
                  error={Boolean(errors.owner)}
                  name="owner"
                  variant="outlined"
                  inputProps={{
                    'data-testid': 'new-owner-input'
                  }}
                  helperText={errors.owner && <i className="text-alert">{errors.owner}</i>}
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item container justify="center">
              <Button
                color="primary"
                variant="contained"
                onClick={handleClickOpen}
                disabled={transferDisabled}
                data-testid="transfer-button"
              >
                Transfer
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">WARNING!</DialogTitle>
            <DialogContent>
              <Typography id="alert-dialog-description" variant="body2">
                You are transferring your relayer ownership. Once transferred, you will no longer receive trading fees through your Relayer. You will not be able to withdraw the remaining deposit. The address that you transfer to will become the new owner of the relayer, including both the deposit and the fees received from the future trades. Do NOT transfer to an exchange address or a smart contract address.
              </Typography>
            </DialogContent>
            <Box display="flex" justifyContent="space-between" className="p-1">
              <Button
                onClick={handleClose}
                color="primary"
                data-testid="cancel-transfer-request"
              >
                Cancel
              </Button>
              <Button
                onClick={confirmAndClose}
                color="primary"
                variant="contained"
                disabled={transferDisabled}
                data-testid="accept-button"
              >
                Accept
              </Button>
            </Box>
          </Dialog>
        </form>
      )}
    </Container>
  )
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.transferForm
export default compose(formConnect, storeConnect, withRouter)(FormTransfer)

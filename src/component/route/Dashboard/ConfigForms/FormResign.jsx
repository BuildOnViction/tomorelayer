import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { compose } from 'service/helper'
import { ResignNotice } from './PresentComponents'
import { wrappers } from './forms'
import { SubmitConfigFormPayload, RefundRelayer } from '../actions'


const FormResign = props => {
  const {
    handleSubmit,
    values,
    submitForm,
    isSubmitting,
    relayer,
  } = props

  const [step, setStep] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const nextStep = () => setStep(1)

  const confirmAndClose = () => {
    handleClose()
    submitForm()
  }

  if (relayer.resigning) {
    const date = new Date(relayer.lock_time * 1000)
    const elapsed = date - Date.now() > 0
    return (
      <Container className="border-all border-rounded p-5" maxWidth="xl">
        <Box display="flex" flexDirection="column">
          <Box m={2}>
            <Typography component="h1">
              Refund
            </Typography>
          </Box>
          <Box m={3}>
            <Typography component="div">
              You can ask for withdrawal after the deposit lock-time has elapsed
            </Typography>
          </Box>
          <Box m={8}>
            ....counting down
          </Box>
          <Box display="flex" justifyContent="center" m={2}>
            <Button onClick={props.RefundRelayer} disabled={elapsed} color="primary" variant="contained">
              Refund
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  return (
    <Container className="border-all border-rounded p-5" maxWidth="xl">
      {step === 0 && <ResignNotice confirm={nextStep} />}
      {step === 1 && (
        <form onSubmit={handleSubmit}>
          <input name="coinbase" value={values.coinbase} hidden readOnly />
          <Grid container direction="column" spacing={3}>
            <Grid item className="mb-1">
              <Typography component="h1">
                Resign
              </Typography>
            </Grid>
            <Grid item>
              <Typography component="div">
                If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.
              </Typography>
              <Box display="flex" justifyContent="flex-end">
                <Button color="primary" onClick={handleClickOpen} disabled={isSubmitting}>
                  Resign
                </Button>
              </Box>
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ className: 'p-1' }}
          >
            <DialogTitle id="alert-dialog-title">WARNING!</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.
              </DialogContentText>
              <TextField
                value={values.coinbase}
                readOnly
                disabled
                name="Coinbase"
                label="Coinbase"
                className="mt-1 mb-1"
                fullWidth
              />
            </DialogContent>
            <Box display="flex" justifyContent="space-between" className="p-1">
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmAndClose} color="secondary" variant="contained" autoFocus>
                Proceed
              </Button>
            </Box>
          </Dialog>
        </form>
      )}
    </Container>
  )
}

const mapProps = state => ({
  storeState: state,
})

const actions = {
  RefundRelayer,
  SubmitConfigFormPayload,
}

const storeConnect = connect(mapProps, actions)

export default compose(
  wrappers.resignForm,
  storeConnect,
)(FormResign)

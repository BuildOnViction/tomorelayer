import React from 'react'
import { withRouter } from 'react-router-dom'
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
import { ResignNotice } from './PresentComponents'
import { wrappers } from '../form_logics'
import { $submitConfigFormPayload } from '../actions'

const InnerResignForm = ({
  coinbase,
  handleSubmit,
  values,
  errors,
  submitForm,
  isSubmitting,
}) => {
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const confirmAndClose = () => {
    handleClose()
    submitForm()
  }

  return (
    <form onSubmit={handleSubmit}>
      <input name="coinbase" value={coinbase} hidden readOnly />
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
            <Button color="primary" onClick={handleClickOpen}>
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
  )
}

const mapProps = state => ({
  coinbase: state.User.activeRelayer.coinbase,
})

const storeConnect = connect(mapProps, { $submitConfigFormPayload })
const formConnect = wrappers.resignForm(InnerResignForm)
const WrappedResignForm = withRouter(storeConnect(formConnect))

const FormResign = () => {
  const [step, setStep] = React.useState(0)
  const nextStep = () => setStep(1)
  return (
    <Container className="border-all border-rounded p-5" maxWidth="xl">
      {step === 0 && <ResignNotice confirm={nextStep} />}
      {step === 1 && <WrappedResignForm />}
    </Container>
  )
}

export default FormResign

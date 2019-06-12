import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { TransferNotice } from './PresentComponents'
import { wrappers } from '../form_logics'
import { $submitConfigFormPayload } from '../actions'

const InnerTransferForm = ({
  currentAddress,
  currentCoinbase,
  handleChange,
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

  const transferBtnDisabled = (
    isSubmitting ||
    (currentCoinbase === values.new_coinbase && currentAddress === values.new_address)
  )

  return (
    <form onSubmit={handleSubmit}>
      <input name="currentCoinbase" value={currentCoinbase} hidden readOnly />
      <Grid container direction="column" spacing={3}>
        <Grid item className="mb-2">
          <Typography component="h1">
            Transfer Ownership
          </Typography>
        </Grid>
        <Grid item>
          <Typography component="h5">
            Which address and coinbase would you like to transfer to?
          </Typography>
        </Grid>
        <Grid item>
          <TextField
            label="New Address"
            value={values.new_address}
            onChange={handleChange}
            error={errors.new_address}
            name="new_address"
            helperText={errors.address && <i className="text-alert">Invalid address!</i>}
            fullWidth
          />
        </Grid>
        <Grid item>
          <TextField
            label="New Coinbase"
            value={values.new_coinbase}
            onChange={handleChange}
            error={errors.new_coinbase}
            name="new_coinbase"
            helperText={errors.coinbase && <i className="text-alert">Invalid coinbase!</i>}
            fullWidth
          />
        </Grid>
        <Grid item className="mt-4">
          <Box display="flex" justifyContent="flex-end">
            <Button color="primary" variant="contained" onClick={handleClickOpen} disabled={transferBtnDisabled}>
              Transfer
            </Button>
          </Box>
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
          <DialogContentText id="alert-dialog-description">
            <Typography>
              If you use this site regularly and would like to help keep the site on the Internet, please consider donating a small sum to help pay for the hosting and bandwidth bill.
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions className="p-2">
          <Button onClick={handleClose} color="primary">
            Disagree
          </Button>
          <Button onClick={confirmAndClose} color="secondary" variant="contained" autoFocus>
            Proceed
          </Button>
        </DialogActions>
      </Dialog>
    </form>
  )
}

const mapProps = state => ({
  currentAddress: state.authStore.user_meta.address,
  currentCoinbase: state.User.activeRelayer.coinbase,
})

const storeConnect = connect(mapProps, { $submitConfigFormPayload })
const formConnect = wrappers.transferForm(InnerTransferForm)
const WrappedTransferForm = storeConnect(formConnect)

const FormTransfer = () => {
  const [step, setStep] = React.useState(0)
  const nextStep = () => setStep(1)
  return (
    <Container className="border-all border-rounded p-5" maxWidth="xl">
      {step === 0 && <TransferNotice confirm={nextStep} />}
      {step === 1 && <WrappedTransferForm />}
    </Container>
  )
}

export default FormTransfer

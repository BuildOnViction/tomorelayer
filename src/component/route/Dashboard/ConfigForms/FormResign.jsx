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
import { refundRelayer } from 'service/blockchain'
import { CountdownClock } from 'component/shared/CountdownClock'
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

const formProps = state => ({
  coinbase: state.User.activeRelayer.coinbase,
})
const formActions = { $submitConfigFormPayload }
const innerFormStoreConnect = connect(formProps, formActions)
const formConnect = wrappers.resignForm(InnerResignForm)
const WrappedResignForm = withRouter(innerFormStoreConnect(formConnect))


class FormResign extends React.Component {
  state = {
    step: 0
  }

  nextStep = () => this.setState({ step: 1 })

  renderResignForm = step => {
    return (
      <Container className="border-all border-rounded p-5" maxWidth="xl">
        {step === 0 && <ResignNotice confirm={this.nextStep} />}
        {step === 1 && <WrappedResignForm />}
      </Container>
    )
  }

  renderWithdrawForm = lock_time => {
    const date = new Date(lock_time * 1000)
    const elapsed = date - Date.now() < 0
    const refund = async () => refundRelayer(this.props.storeState)
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
          <Box m={3}>
            <CountdownClock date={date} />
          </Box>
          <Box display="flex" justifyContent="center" m={2}>
            <Button onClick={refund} disabled={elapsed} color="primary">
              Refund
            </Button>
          </Box>
        </Box>
      </Container>
    )
  }

  render() {
    const step = this.state.step
    const { resigning, lock_time } = this.props
    return resigning ? this.renderWithdrawForm(lock_time) : this.renderResignForm(step)
  }
}


const mapProps = state => ({
  storeState: state,
  resigning: state.User.activeRelayer.resigning,
  lock_time: state.User.activeRelayer.lock_time,
})

const outerConnect = connect(mapProps)

export default outerConnect(FormResign)

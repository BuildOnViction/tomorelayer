import React from 'react'
import { connect } from 'redux-zero/react'
import {
  addDays,
  distanceInWordsToNow,
  format as timeFormat,
  isPast,
  parse as dateParse,
} from 'date-fns'
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import TextIcon from '@material-ui/icons/AccountCircle'
import WalletIcon from '@material-ui/icons/AccountBalanceWallet'
import {
  AlertVariant,
  PushAlert,
  PouchDelete,
} from 'service/frontend'
import * as http from 'service/backend'
import { ResignNotice } from './PresentComponents'


const FormResign = props => {
  const {
    relayer,
    RelayerContract,
    PushAlert,
    updateRelayer,
    refundRelayer,
  } = props

  const [step, setStep] = React.useState(0)
  const [open, setOpen] = React.useState(false)
  const handleClickOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const nextStep = () => setStep(1)

  const confirmAndClose = async () => {
    handleClose()
    const { status, details } = await RelayerContract.resign({ coinbase: relayer.coinbase })

    if (!status) {
      const alert = { variant: AlertVariant.error, message: details }
      return PushAlert(alert)
    }

    const resigningRelayer = await http.updateRelayer({
      ...relayer,
      resigning: true,
      lock_time: timeFormat(addDays(Date.now(), 28), 'X'),
    })

    if (!status) {
      let alert = { variant: AlertVariant.error, message: details }
      PushAlert(alert)
    } else {
      PushAlert({ variant: AlertVariant.success, message: 'relayer resigned' })
    }

    return updateRelayer(resigningRelayer)
  }


  const requestRefund = async () => {
    const { status, details } = await RelayerContract.refund({ coinbase: relayer.coinbase })

    if (!status) {
      const alert = { variant: AlertVariant.error, message: details }
      return PushAlert(alert)
    }

    await http.deleteRelayer(relayer.id)
    await PouchDelete(this.props.pouch, `relayer${relayer.id}`)
    return refundRelayer(relayer.id)
  }


  if (relayer.resigning) {
    const remainingTime = distanceInWordsToNow(dateParse(relayer.lock_time * 1000))
    const withdrawalable = isPast(dateParse(relayer.lock_time * 1000))
    return (
      <Grid container direction="column" item spacing={4}>
        <Grid item>
          <Typography variant="h6">
            The relayer is resigning
          </Typography>
        </Grid>
        <Grid item>
          You can ask for withdrawal after the deposit lock-time has elapsed
        </Grid>
        <Grid item>
          {withdrawalable ? `Lock time has elapsed for ${remainingTime}, you can withdraw now` : `${remainingTime} remaining`}
        </Grid>
        <Grid item container justify="flex-start">
          <Button onClick={requestRefund} disabled={!withdrawalable} color="primary" variant="contained" data-testid="refund-button">
            Refund
          </Button>
        </Grid>
      </Grid>
    )
  }

  return (
    <Container>
      {step === 0 && <ResignNotice confirm={nextStep} />}
      {step === 1 && (
        <Box>
          <Grid item container direction="column" spacing={6}>
            <Grid item>
              <Typography variant="h5">
                Resign your relayer
              </Typography>
            </Grid>
            <Grid item>
              Please take some time to understand some important things for your own safety.
              We cannot recover your funds or freeze your account if you visit a phishing site or lose your backup phrase (aka SEED phrase).
              Please review all the below information one more time before proceeding to official resignation.
            </Grid>
            <Grid item>
              <Paper elevation={0} className="p-1">
                <Grid container direction="column" spacing={2}>
                  <Grid item container alignItems="center">
                    <TextIcon className="text-hint mr-1" /> {relayer.name}
                  </Grid>
                  <Grid item container alignItems="center">
                    <WalletIcon className="text-hint mr-1" /> {relayer.coinbase}
                  </Grid>
                </Grid>
              </Paper>
            </Grid>
            <Grid item container justify="center">
              <Button onClick={handleClickOpen} data-testid="resign-button" color="primary" variant="contained">
                Resign
              </Button>
            </Grid>
          </Grid>
          <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            PaperProps={{ style: { padding: 5 } }}
          >
            <DialogTitle id="alert-dialog-title">WARNING!</DialogTitle>
            <DialogContent>
              <Typography id="alert-dialog-description" variant="body2">
                Once resigned, you cannot undo the cancelling process and your business with this relayer will be terminated permanently
              </Typography>
            </DialogContent>
            <Box display="flex" justifyContent="space-between" className="p-1">
              <Button onClick={handleClose} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmAndClose} color="primary" variant="contained" data-testid="accept-button">
                Accept
              </Button>
            </Box>
          </Dialog>
        </Box>
      )}
    </Container>
  )
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract,
  pouch: state.pouch,
})

const actions = {
  PushAlert,
  updateRelayer: (state, relayer) => {
    const Relayers = Array.from(state.Relayers)
    const index = Relayers.findIndex(r => r.id === relayer.id)
    Relayers[index] = relayer
    return { Relayers, shouldUpdateUserRelayers: true }
  },
  refundRelayer: (state, relayerId) => {
    const Relayers = Array.from(state.Relayers).filter(r => r.id === relayerId)
    return { Relayers, shouldUpdateUserRelayers: true }
  }
}

const storeConnect = connect(mapProps, actions)

export default storeConnect(FormResign)

import React from 'react'
import {
  Button,
  Grid,
  Typography,
} from '@material-ui/core'
import transferImage from 'asset/Transfer-icon.svg'
import resignImage from 'asset/Resign-icon.svg'


export const TransferNotice = ({ confirm }) => (
  <Grid item container spacing={5}>
    <Grid item xs={12}>
      <Typography variant="h6">
        What you need to know about Relayer-Transfer
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6} md={4} className="p-0 text-center">
      <img alt="" src={transferImage} width="150px" height="150px" />
    </Grid>
    <Grid item xs={12} sm={12} md={8}>
      You are transferring your relayer ownership. Once transferred, you will no longer receive trading fees. You will not be able to withdraw the remainning deposit. The address that you transfer to will become the new owner of the relayer, including both the deposit and the fees received from the future trades.
    </Grid>
    <Grid item container justify="center" className="mt-3">
      <Button onClick={confirm} color="primary" variant="contained">
        Yes, I understand
      </Button>
    </Grid>
  </Grid>
)


export const ResignNotice = ({ confirm }) => (
  <Grid item container spacing={5}>
    <Grid item xs={12}>
      <Typography variant="h6">
        What you need to know about Relayer-Resign
      </Typography>
    </Grid>
    <Grid item xs={12} sm={6} md={4} className="p-0 text-center">
      <img alt="" src={resignImage} width="150px" height="150px" />
    </Grid>
    <Grid item xs={12} sm={12} md={8}>
      You are shutting down your relayer. Traders will no longer be able to trade on your relayer. All services provided by your relayer will be immediately terminated. For orders that are currently being processed, you will still receive their fees once they finalized. Your remaining deposit will be available for withdrawal 28 (twenty-eight) days after the on-chain confirmation.
    </Grid>
    <Grid item container justify="center" className="mt-3">
      <Button onClick={confirm} color="primary" variant="contained">
        Yes, I understand
      </Button>
    </Grid>
  </Grid>
)

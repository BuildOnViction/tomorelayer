import React from 'react'
import { connect } from 'redux-zero/react'
import { Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { Grid } from 'component/utility'
import { $backOneStep, $registerRelayer } from './actions'


const tableData = meta => {
  console.log(meta);
  return [
    { key: 'Relayer Name', value: meta.name },
    { key: 'Coinbase', value: meta.coinbase },
    { key: 'Deposit', value: meta.deposit + ' TOMO' },
    { key: 'Maker Fee', value: meta.makerFee + ' %' },
    { key: 'Taker Fee', value: meta.takerFee + ' %' },
    { key: 'Token Pairs', value: meta.fromTokens.map((t,idx) => `${t.symbol}/${meta.toTokens[idx].symbol}`).join(', ') },
  ]
}


const Review = ({ meta, ...props }) => (
  <div className="text-left">
    <h1 className="register-form--title text-center">
      Review
    </h1>
    <div className="row mt-1">
      <Table>
        <TableBody>
          {tableData(meta).map(row => (
            <TableRow key={row.key}>
              <TableCell component="th" scope="row">
                {row.key}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
    <Grid className="justify-space-between m-0 mt-2">
      <Button variant="outlined" className="mr-1" onClick={props.$backOneStep} type="button">
        Back
      </Button>
      <Button color="primary" variant="contained" type="button" onClick={props.$registerRelayer}>
        Confirm
      </Button>
    </Grid>
  </div>
)

const storeConnect = connect(
  state => ({
    meta: state.RelayerForm.relayer_meta
  }),
  {
    $backOneStep,
    $registerRelayer,
  },
)

export default storeConnect(Review)

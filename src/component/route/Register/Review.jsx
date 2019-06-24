import React from 'react'
import { Box, Button, Table, TableBody, TableCell, TableRow } from '@material-ui/core'
import { round } from 'service/helper'


const tableData = (meta, pairs) => {
  return [
    { key: 'Relayer Name', value: meta.name },
    { key: 'Coinbase', value: meta.coinbase },
    { key: 'Deposit', value: meta.deposit + ' TOMO' },
    { key: 'Maker Fee', value: round(meta.maker_fee, 2) + '%' },
    { key: 'Taker Fee', value: round(meta.taker_fee, 2) + '%' },
    { key: 'Token Pairs', value: pairs.map(p => p.toString()).join(', ') },
  ]
}


const Review = ({
  meta,
  goBack,
  registerRelayer,
}) => {
  const pairs = document.__memoizedUserSelectedPairs__ || []
  return (
    <div className="text-left">
      <h1 className="register-form--title text-center">
        Review
      </h1>
      <div className="row mt-1">
        <Table>
          <TableBody>
            {tableData(meta, pairs).map(row => (
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
      <Box display="flex" justifyContent="space-between" className="mt-2">
        <Button variant="outlined" className="mr-1" type="button" onClick={goBack}>
          Back
        </Button>
        <Button color="primary" variant="contained" type="button" onClick={registerRelayer}>
          Confirm
        </Button>
      </Box>
    </div>
  )
}

export default Review

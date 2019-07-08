import React from 'react'
import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Typography,
} from '@material-ui/core'
import { round } from 'service/helper'
import { withStyles } from '@material-ui/core/styles'



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

const StyledTableCell = withStyles(theme => ({
  root: {
    border: 'none',
    paddingBottom: '10px',
  },
  body: {
    color: '#CFCDE1',
  },
  alignLeft: {
    color: '#7473A6',
  }

}))(TableCell)


const Review = ({
  meta,
  goBack,
  registerRelayer,
}) => {
  const pairs = document.__memoizedUserSelectedPairs__ || []
  return (
    <Box>
      <Typography variant="h5">
        Review
      </Typography>
      <Paper className="mt-1 p-1" elevation={0}>
        <Table>
          <TableBody>
            {tableData(meta, pairs).map(row => (
              <TableRow key={row.key}>
                <StyledTableCell>
                  {row.key}
                </StyledTableCell>
                <StyledTableCell align="left">
                  {row.value}
                </StyledTableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Box display="flex" justifyContent="space-between" className="mt-2">
        <Button color="secondary" variant="contained" className="mr-1" type="button" onClick={goBack}>
          Back
        </Button>
        <Button color="primary" variant="contained" type="button" onClick={registerRelayer}>
          Confirm
        </Button>
      </Box>
    </Box>
  )
}

export default Review

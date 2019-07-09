import React from 'react'
import cx from 'classnames'
import {
  Avatar,
  Box,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { round, isEmpty } from 'service/helper'
import { AdapterLink } from 'component/shared/Adapters'

const RelayerAvatar = withStyles(theme => ({
  root: {
    width: 40,
    height: 40,
    borderRadius: '50%',
  }
}))(Avatar)

const HeadTableCell = withStyles(theme => ({
  root: {
    border: 'none',
    color: '#7473A6',
    fontSize: '0.9rem',
  },
}))(TableCell)

const BodyTableCell = withStyles(theme => ({
  root: {
    border: 'none',
    color: '#CFCDE1',
  }
}))(TableCell)

const RelayerStatus = ({ resigning }) => {
  const statusIconClass = bol => cx(
    'relayer-status',
    {
      'relayer-status__resigning': bol,
      'relayer-status__active': !bol,
    }
  )

  return (
    <Box display="flex" alignItems="center" justifyContent="flex-end">
      <span style={{ marginRight: 10 }}>{resigning ? 'Resigning' : 'Active'}</span>
      <i className={statusIconClass(resigning)} />
    </Box>
  )
}

const RelayerTable = ({ relayers }) => (
  <Paper className="p-1" elevation={0}>
    <Table>
      <TableHead>
        <TableRow>
          <HeadTableCell>Relayer</HeadTableCell>
          <HeadTableCell align="right">Balance</HeadTableCell>
          <HeadTableCell align="right">Status</HeadTableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {Object.values(relayers).map(row => (
          <TableRow key={row.name}>
            <BodyTableCell component="th" scope="row">
              <Box display="flex" alignItems="center">
                <RelayerAvatar src={row.logo} alt={row.name} className="mr-1" />
                <Link href={row.link}>{row.name}</Link>
              </Box>
            </BodyTableCell>
            <BodyTableCell align="right">
              {row.deposit} TOMO
            </BodyTableCell>
            <BodyTableCell align="right">
              <RelayerStatus resigning={row.resigning} />
            </BodyTableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </Paper>
)


const NoRelayer = () => (
  <Box>
    <Typography component="h3">
      You have yet to create a relayer
    </Typography>
    <Typography component="div">
      Register a relayer <Link component={AdapterLink} to="/register">here</Link>
    </Typography>
  </Box>
)


export default class UserBalance extends React.Component {

  render() {
    const {
      balance,
      relayers,
    } = this.props

    const formattedBalance = `${round(balance, 3)}...`

    return (
      <Box display="flex" flexDirection="column">
        <Box className="mb-4">
          <Typography component="div">
            Wallet Balance (TOMO)
          </Typography>
          <TextField value={formattedBalance} fullWidth disabled variant="outlined" margin="dense" />
        </Box>
        <Box>
          {isEmpty(relayers) ? (
            <NoRelayer />
          ) : (
            <React.Fragment>
              <Typography component="div">
                Relayer Contract Balance
              </Typography>
              <RelayerTable relayers={relayers} />
            </React.Fragment>
          )}
        </Box>
      </Box>
    )
  }
}

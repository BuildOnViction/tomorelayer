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
import { isEmpty } from 'service/helper'
import { CustomLink } from 'component/shared/Adapters'

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
    },
    'mr-1',
  )

  return (
    <Box display="flex" alignItems="center">
      <i className={statusIconClass(resigning)} />
      <span>{resigning ? 'Resigning' : 'Active'}</span>
    </Box>
  )
}

const RelayerTable = ({ relayers }) => (
  <Paper className="p-1" elevation={0}>
    <Table>
      <TableHead>
        <TableRow>
          <HeadTableCell>Relayer</HeadTableCell>
          <HeadTableCell>Balance</HeadTableCell>
          <HeadTableCell>Status</HeadTableCell>
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
            <BodyTableCell>
              {row.deposit} TOMO
            </BodyTableCell>
            <BodyTableCell>
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
      Register a relayer <CustomLink to="/register">here</CustomLink>
    </Typography>
  </Box>
)


export default class UserBalance extends React.Component {

  render() {
    const {
      balance,
      relayers,
    } = this.props

    return (
      <Box display="flex" flexDirection="column">
        <Box className="mb-4">
          <Typography component="div">
            Wallet Balance
          </Typography>
          <TextField
            value={balance}
            fullWidth
            disabled
            variant="outlined"
            margin="dense"
            InputProps={{ endAdornment: 'TOMO' }}
          />
        </Box>
        <Box>
          {isEmpty(relayers) ? (
            <NoRelayer />
          ) : (
            <React.Fragment>
              <Typography variant="body1" className="mb-1">
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

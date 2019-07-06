import React from 'react'
import {
  Avatar,
  Box,
  Container,
  Link,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@material-ui/core'
import { round, isEmpty } from 'service/helper'
import { AdapterLink } from 'component/shared/Adapters'


const RelayerTable = ({ relayers }) => (
  <Table>
    <TableHead>
      <TableRow>
        <TableCell>Relayer</TableCell>
        <TableCell align="right">Balance</TableCell>
        <TableCell align="right">Status</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {Object.values(relayers).map(row => (
        <TableRow key={row.name}>
          <TableCell component="th" scope="row">
            <Box display="flex" alignItems="center">
              <Avatar
                src={row.logo}
                alt={row.name}
                style={{ borderRadius: '50%', width: 40, height: 40 }}
                className="mr-1"
              />
              <Typography component="div">
                <Link href={row.link}>
                  {row.name}
                </Link>
              </Typography>
            </Box>
          </TableCell>
          <TableCell align="right">
            {row.deposit}
          </TableCell>
          <TableCell align="right">
            {row.resigning.toString()}
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
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
      <Container maxWidth="sm">
        <Box display="flex" flexDirection="column">
          <Box className="mb-4">
            <Typography component="div">
              Wallet Balance (TOMO)
            </Typography>
            <TextField value={formattedBalance} fullWidth variant="outlined" margin="dense" />
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
      </Container>
    )
  }
}

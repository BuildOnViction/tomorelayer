import React from 'react'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core'
import * as blk from 'service/blockchain'
import { getAccountTx } from 'service/backend'
import { TabMap } from 'service/helper'
import UserBalance from './UserBalance'
import AccountTx from './AccountTx'

const NavMenu = new TabMap(
  'Balance',
  'Transactions',
)

export default class Profile extends React.Component {
  state = {
    address: '',
    balance: '',
    selectedInfo: NavMenu.balance,
    tx: {},
  }

  async componentDidMount() {
    const address = await this.props.user.wallet.getAddress()
    const balance = await blk.getBalance(address)
    const tx = await getAccountTx({ address, type: 'in', page: 1 })
    this.setState({ address, balance, tx })
  }

  changeInfoBoard = (selectedInfo) => () => this.setState({ selectedInfo })

  render() {
    const {
      address,
      balance,
      tx,
      selectedInfo,
    } = this.state

    const {
      relayers,
      user,
    } = this.props

    return (
      <Box>
        <Typography variant="h5">
          Owner Profile
        </Typography>
        <Typography variant="body2">
          {address}
        </Typography>
        <Grid container className="mt-4">
          <Grid item md={3} className="pr-5">
            <List component="nav">
              {NavMenu.map((item, idx) => (
                <ListItem key={item} button className="mb-1" onClick={this.changeInfoBoard(item)} selected={selectedInfo === item}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item md={7} sm={12}>
            {selectedInfo === NavMenu.balance && <UserBalance relayers={relayers} user={user} balance={balance} />}
            {selectedInfo === NavMenu.transactions && <AccountTx tx={tx} />}
          </Grid>
        </Grid>
      </Box>
    )
  }
}

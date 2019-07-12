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
import UserBalance from './UserBalance'

const ListItems = [
  'Balance',
  'Transactions',
]

export default class Profile extends React.Component {
  state = {
    address: '',
    balance: '',
    selectedInfo: 0,
  }

  async componentDidMount() {
    const address = await this.props.user.wallet.getAddress()
    const balance = await blk.getBalance(address)
    this.setState({ address, balance })
  }

  changeInfoBoard = (selectedInfo) => () => this.setState({ selectedInfo })

  render() {
    const {
      address,
      balance,
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
              {ListItems.map((item, idx) => (
                <ListItem key={item} button className="mb-1" onClick={this.changeInfoBoard(idx)} selected={idx === selectedInfo}>
                  <ListItemText primary={item} />
                </ListItem>
              ))}
            </List>
          </Grid>
          <Grid item md={7} sm={12}>
            {selectedInfo === 0 && <UserBalance relayers={relayers} user={user} balance={balance} />}
          </Grid>
        </Grid>
      </Box>
    )
  }
}

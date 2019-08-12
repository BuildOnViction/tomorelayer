import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Box,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import {
  getBalance,
} from 'service/blockchain'
import {
  getAccountTx,
} from 'service/backend'
import { TabMap } from 'service/helper'
import UserBalance from './UserBalance'
import AccountTx from './AccountTx'

const NavMenu = new TabMap(
  'Balance',
  'Transactions',
)

const PaginationDefault = {
  limit: 10,
  page: 1,
}

const StyledListItem = withStyles(theme => ({
  root: {
    borderRadius: 10,
    padding: '5px 5px 5px 45px',
    maxWidth: 200,
    marginBottom: 10,
    '&:hover': {
      backgroundColor: theme.palette.navItemSelected,
    },
  },
  selected: {
    backgroundColor: `${theme.palette.navItemSelected} !important`,
  },
}))(ListItem)

class Profile extends React.Component {
  state = {
    address: '',
    balance: '',
    selectedInfo: NavMenu.balance,
    tx: {},
  }

  async componentDidMount() {
    const address = await this.props.user.wallet.getAddress()
    const balance = await getBalance(address)
    const tx = await getAccountTx({
      ownerAddress: address,
      contractAddress: this.props.contractAddress,
      type: 'in',
      ...PaginationDefault,
    })

    this.setState({ address, balance, tx })
  }

  changeInfoBoard = (selectedInfo) => () => this.setState({ selectedInfo })

  onTxTypeChange = async (newTxType) => {
    const tx = await getAccountTx({
      ownerAddress: this.state.address,
      contractAddress: this.props.contractAddress,
      type: newTxType,
      ...PaginationDefault,
    })

    this.setState({ tx })
  }

  render() {
    const {
      address,
      balance,
      selectedInfo,
      tx,
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
                <StyledListItem key={item} button className="mb-1" onClick={this.changeInfoBoard(item)} selected={selectedInfo === item}>
                  <ListItemText primary={item} />
                </StyledListItem>
              ))}
            </List>
          </Grid>
          <Grid item md={7} sm={12}>
            {selectedInfo === NavMenu.balance && <UserBalance relayers={relayers} user={user} balance={balance} />}
            {selectedInfo === NavMenu.transactions && <AccountTx onTxTypeChange={this.onTxTypeChange} tx={tx} />}
          </Grid>
        </Grid>
      </Box>
    )
  }
}

const mapProps = (state) => {
  const { Contracts } = state
  const contractAddress = Contracts.find(contract => contract.name === 'RelayerRegistration').address

  return { contractAddress }
}

export default connect(mapProps)(Profile)

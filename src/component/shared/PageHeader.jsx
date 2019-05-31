import React from 'react'
import { Link } from 'react-router-dom'
import { Grid } from 'component/utility'
import { TextField } from '@material-ui/core'
import logo from 'asset/app-logo.png'
import UserMenu from './UserMenu'
import UserRelayerList from './UserRelayerList'

class PageHeader extends React.Component {
  state = {
    userMenuEl: null,
    relayerMenuEl: null,
  }

  menuItemClick = which => event => {
    this.setState({ userMenuEl: null })
  }

  openMenu = event => {
    this.setState({ userMenuEl: event.currentTarget })
  }

  openRelayerMenu = event => {
    this.setState({ relayerMenuEl: event.currentTarget })
  }

  clickAway = () => this.setState({
    userMenuEl: null,
    relayerMenuEl: null,
  })

  render() {
    return (
      <Grid className="main-menu justify-start align-center border-bottom">
        <div className="col-md-3 col-xs-2 col-xxs-2">
          <Link to="/">
            <img alt="logo" src={logo} height="40" />
          </Link>
        </div>
        <div className="col-md-5 hidden-sm hidden-xs hidden-xxs">
          <TextField
            label="Search"
            margin="dense"
            variant="outlined"
            fullWidth
          />
        </div>
        <div className="col-md-4 text-center row">
          <UserRelayerList
            anchorEl={this.state.relayerMenuEl}
            openRelayerMenu={this.openRelayerMenu}
            handleClickAway={this.clickAway}
          />
          <UserMenu
            anchorEl={this.state.userMenuEl}
            openMenu={this.openMenu}
            handleClickAway={this.clickAway}
          />
        </div>
        <div className="col-12 hidden-md hidden-lg hidden-xxl">
          <input
            name="free-search"
            type="text"
            placeholder="Search..."
            className="form-control col-12"
          />
        </div>
      </Grid>
    )
  }
}

export default PageHeader

import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { Button, TextField, Menu, MenuItem } from '@material-ui/core'
import KeyboardArrowDown from '@material-ui/icons/KeyboardArrowDown';
import logo from 'asset/app-logo.png'


class PageHeader extends React.Component {
  state = {
    anchorEl: null,
  }

  menuItemClick = which => event => {
    this.setState({ anchorEl: null })
  }

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

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
          <div className="col-md-6">
            <Button>
              <Link to="/register">
                Create your relayer
              </Link>
            </Button>
          </div>
          <div className="col-md-6">
            <Button onClick={this.openMenu}>
              MyWallet&nbsp;
              <KeyboardArrowDown />
            </Button>
            <Menu id="simple-menu" open={!!this.state.anchorEl} anchorEl={this.state.anchorEl}>
              <MenuItem onClick={this.menuItemClick('profile')}>Profile</MenuItem>
              <MenuItem onClick={this.menuItemClick('account')}>My account</MenuItem>
              <MenuItem onClick={this.menuItemClick('logout')}>Logout</MenuItem>
              <MenuItem onClick={this.menuItemClick('cancel')} className="menu-item--cancel">
                Cancel
              </MenuItem>
            </Menu>
          </div>
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


const mapProps = state => ({
  address: state.authStore.user_meta.address
})

export default connect(mapProps)(PageHeader)

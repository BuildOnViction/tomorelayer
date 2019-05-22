import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { Button, TextField } from '@material-ui/core'
import logo from 'asset/app-logo.png'
import UserMenu from './UserMenu'


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

  createRelayer = () => {
    const { history, auth } = this.props
    history.push(auth ? '/register' : '/login')
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
            <Button onClick={this.createRelayer}>
              Create your relayer
            </Button>
          </div>
          {this.props.auth ? (
            <UserMenu
              openMenu={this.openMenu}
              anchorEl={this.state.anchorEl}
              menuItemClick={this.menuItemClick}
            />
          ) : (
            <div className="col-md-6">
              <Button>
                <Link to="/login">
                  LOGIN
                </Link>
              </Button>
            </div>
          )}
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
  address: state.authStore.user_meta.address,
  auth: state.authStore.auth,
})

export default connect(mapProps)(withRouter(PageHeader))

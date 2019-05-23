import React from 'react'
import { Link, withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { Grid } from 'component/utility'
import { Button, TextField } from '@material-ui/core'
import logo from 'asset/app-logo.png'
import UserMenu from './UserMenu'
import UserRelayerList from './UserRelayerList'
import { $changeActiveRelayer } from '../actions'


class PageHeader extends React.Component {
  state = {
    anchorEl: null,
    relayerListAnchorEl: null,
  }

  menuItemClick = which => event => {
    this.setState({ anchorEl: null })
  }

  openMenu = event => {
    this.setState({ anchorEl: event.currentTarget })
  }

  openRelayerMenu = event => {
    this.setState({ relayerListAnchorEl: event.currentTarget })
  }

  createRelayer = () => {
    const { history, auth } = this.props
    history.push(auth ? '/register' : '/login')
  }

  clickAway = () => this.setState({
    anchorEl: null,
    relayerListAnchorEl: null,
  })

  render() {
    const {
      relayers,
      activeRelayer,
      auth,
    } = this.props

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
          {relayers.length === 0 && (
            <div className="col-md-6">
              <Button onClick={this.createRelayer} size="small">
                Create your relayer
              </Button>
            </div>
          )}
          {relayers.length > 0 && (
            <UserRelayerList
              activeRelayer={activeRelayer}
              relayers={relayers}
              changeActiveRelayer={this.props.$changeActiveRelayer}
              anchorEl={this.state.relayerListAnchorEl}
              openRelayerMenu={this.openRelayerMenu}
              createRelayer={this.createRelayer}
              handleClickAway={this.clickAway}
            />
          )}
          {auth ? (
            <UserMenu
              openMenu={this.openMenu}
              anchorEl={this.state.anchorEl}
              menuItemClick={this.menuItemClick}
            />
          ) : (
            <div className="col-md-6">
              <Button size="small" component={props => <Link to="/login" {...props} />}>
                LOGIN
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
  relayers: state.User.relayers,
  activeRelayer: state.User.activeRelayer,
})

export default connect(mapProps, { $changeActiveRelayer })(withRouter(PageHeader))

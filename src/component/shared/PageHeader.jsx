import React from 'react'
import { connect } from 'redux-zero/react'
import SearchIcon from '@material-ui/icons/Search'
import {
  Box,
  Container,
  Grid,
  InputAdornment,
  Link,
  // Switch,
  TextField,
  Hidden,
  withWidth,
  withStyles,
} from '@material-ui/core'
import {
  isEmpty,
} from 'service/helper'
import {
  FuzzySearch,
} from 'service/frontend'
import {
  UserMenu,
  RelayerMenu,
  StartRelayerButton,
  ResponsiveMenu,
} from './Menus'
import { AdapterLink } from './Adapters'
import logo from 'asset/logo-tomorelayer.svg'

const ref = React.createRef()

const SearchTextField = withStyles(theme => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      '& .MuiOutlinedInput-root': {
        backgroundColor: theme.palette.document,
      },
    },
  },
}))(TextField)

class PageHeader extends React.Component {

  state = {
    searchResult: []
  }

  pouchQuery = async e => {
    const value = e.target.value
    const searchResult = await FuzzySearch(this.props.pouch, value)
    this.setState({ searchResult })
    console.log(searchResult)
  }

  render() {

    const {
      user,
      relayers,
      pouch,
      /* changeTheme,
       * activeTheme, */
    } = this.props

    const auth = Boolean(user.wallet)
    const userOwnRelayer = !isEmpty(relayers)

    return (
      <Box className="tomo-header">
        <Container maxWidth="lg" className="p-1">
          <Grid container direction="row" justify="space-between" alignItems="center">
            <Grid item xs={3} md={2}>
              <img alt="logo" src={logo} height="30px" />
              {/* <Link display="block" component={AdapterLink} to="/">
                  <img alt="logo" src={logo} height="30px" />
                  </Link> */}
            </Grid>
            <Hidden smDown>
              <Grid item xs={6} md={6}>
                <SearchBox onChange={this.pouchQuery} disabled={!Boolean(pouch)}/>
              </Grid>
            </Hidden>
            <Grid item xs={9} md={4} container justify="flex-end" direction="row" spacing={4} alignItems="center">
              <Hidden smDown>
                {auth && userOwnRelayer && <RelayerMenu relayers={relayers} />}
                {auth && !userOwnRelayer && <StartRelayerButton />}
                {auth && <UserMenu />}
              </Hidden>

              <Hidden mdUp>
                {auth && userOwnRelayer && (
                  <ResponsiveMenu ref={ref} relayers={relayers} userOwnRelayer={userOwnRelayer}>
                    <SearchBox />
                  </ResponsiveMenu>
                )}
              </Hidden>
              {!auth && <Link component={AdapterLink} to="/login" className="ml-3">Help</Link>}
              {/* <Switch checked={activeTheme === 'dark'} onChange={() => changeTheme()} /> */}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  }
}

const SearchBox = ({
  disabled,
  onChange,
}) => (
  <SearchTextField
    placeholder="Search for contract, relayer or token data..."
    fullWidth
    variant="outlined"
    onChange={onChange}
    disabled={disabled}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">
          <SearchIcon />
        </InputAdornment>
      )
    }}
  />
)

const mapProps = state => ({
  activeTheme: state.activeTheme,
  pouch: state.pouch,
})

const actions = {
  changeTheme: (state) => ({
    activeTheme: state.activeTheme === 'light' ? 'dark' : 'light'
  }),
}

const PageHeaderResponsive = withWidth()(PageHeader)

export default connect(mapProps, actions)(PageHeaderResponsive)

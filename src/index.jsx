import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider, connect } from 'redux-zero/react'
import App from './component/App'
import store from './service/store'
import theme, { availableThemes } from './theme.config'

const mapTheme = state => ({
  activeTheme: state.activeTheme
})

const BootstrappedApp = connect(mapTheme)(({ activeTheme }) => (
  <MuiThemeProvider theme={theme(availableThemes[activeTheme])}>
    <App />
  </MuiThemeProvider>
))

ReactDOM.render((
  <Provider store={store}>
    <BootstrappedApp />
  </Provider>
), document.getElementById('root'))

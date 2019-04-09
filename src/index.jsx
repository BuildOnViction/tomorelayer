import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import { Provider } from 'redux-zero/react'
import store from './service/store'
import App from './component/App'

const theme = createMuiTheme({
  palette: {
    primary: blue,
  },
  overrides: {
    MuiButton: {
      root: {
        borderRadius: '2px',
      },
      sizeSmall: {
        padding: '4px 12px',
      },
      contained: {
        boxShadow: 'none',
      },
    },
  }
})

ReactDOM.render((
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>
), document.getElementById('root'))

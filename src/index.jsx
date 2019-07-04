import React from 'react'
import ReactDOM from 'react-dom'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Provider } from 'redux-zero/react'
import App from './component/App'
import store from './service/store'
import theme from './theme.config'

ReactDOM.render((
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <App />
    </Provider>
  </MuiThemeProvider>
), document.getElementById('root'))

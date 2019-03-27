import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'redux-zero/react'
import store from './service/store'
import App from './component/App'

ReactDOM.render((
  <Provider store={store}>
    <App />
  </Provider>
), document.getElementById('root'))

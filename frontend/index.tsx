import React from 'react'
import ReactDOM from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import { Provider } from 'redux-zero/react'

import store from './service/store'
import App from './component/App'

const load = () => ReactDOM.render((
  <AppContainer>
    <Provider store={store}>
      <App />
    </Provider>
  </AppContainer>
), document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./component/App', load)
}

load()

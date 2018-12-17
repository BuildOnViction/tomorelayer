import { render } from 'react-dom'
import { AppContainer } from 'react-hot-loader'
import App from './App'

const load = () => render((
  <AppContainer>
    <App />
  </AppContainer>
), document.getElementById('root'))

if (module.hot) {
  module.hot.accept('./App', load)
}

load()

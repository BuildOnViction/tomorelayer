// Creating Initial-Store
import createStore from 'redux-zero'

const initialState = {
  relayerAuthorized: false,
}

const store = createStore(initialState)

export default store

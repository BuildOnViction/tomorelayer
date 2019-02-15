import * as createStore from 'redux-zero'

// NOTE: You can split initialState to multiple sub-stores when necessary
const initialState = {
  auth: false,
  relayerAuthorized: false,
  relayers: [],
  currentUserAddress: '',
  error: '',
  alert: '',
  contracts: {},
  loginModal: false,
}

const store = createStore(initialState)

export default store

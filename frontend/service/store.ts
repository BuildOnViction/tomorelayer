import createStore from 'redux-zero'

// NOTE: You can split initialState to multiple sub-stores when necessary
const initialState = {
  relayerAuthorized: false,
  relayers: [],
  currentUserAddress: '',
  error: '',
  alert: '',
}

const store = createStore(initialState)

export default store

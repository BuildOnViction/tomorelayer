const action = store => ({
  login: _ => ({ relayerAuthorized: true }),
  logout: _ => ({ relayerAuthorized: false }),
})

export default action

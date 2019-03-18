import { connect } from 'redux-zero/react'

const connector = connect(
  null,
  () => ({
    login: () => ({
      auth: true
    })
  })
)

export const LoginAction = connector(props => (
  <div>
    <a className="btn bg-gray" onClick={props.login}>
      Login
    </a>
    <hr />
    <h3>log</h3>
  </div>
))

import React from 'react'
import Button from '@atlaskit/button'
import { withRouter } from 'react-router-dom'

class Welcome extends React.Component {
  goMain = () => this.props.history.push('/home')

  render() {
    return (
      <div>
        <h1>Welcome</h1>
        <Button onClick={this.goMain}>
          Please login
        </Button>
      </div>
    )
  }
}

export default withRouter(Welcome)

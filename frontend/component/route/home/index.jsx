import React from 'react'
import { withRouter } from 'react-router-dom'
import Button from '@atlaskit/button'
import { SITE_MAP } from '@constant'

class Welcome extends React.Component {
  goMain = () => this.props.history.push(SITE_MAP.dashboard)

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

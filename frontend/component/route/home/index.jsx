import React from 'react'
import Button from '@atlaskit/button'
import { withRouter } from 'react-router-dom'
import { SITE_MAP } from '../../../service/constant'

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

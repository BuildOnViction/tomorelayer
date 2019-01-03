import { withRouter } from 'react-router-dom'
import { Button } from '@blueprintjs/core'
import { SITE_MAP } from '@constant'


class Home extends React.Component {
  go = () => this.props.history.push(SITE_MAP.dashboard)

  render() {
    return (
      <div>
        Home
        <hr />
        <Button large intent="warning" text="Click to go!" onClick={this.go} />
      </div>
    )
  }
}

export default withRouter(Home)

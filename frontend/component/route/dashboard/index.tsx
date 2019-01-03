import { withRouter } from 'react-router-dom'
import { Button, Code } from '@blueprintjs/core'


class Dashboard extends React.PureComponent {
  constructor() {
    super()
    this.goHome = this.goHome.bind(this)
  }

  goHome() {
    this.props.history.push('/')
  }

  public render() {
    return (
      <div>
        <div>
          <p>
            <Code>Button</Code>
          </p>
          <Button
            large
            icon="refresh"
            text="Go bacl"
            onClick={this.goHome}
          />
        </div>
      </div>
    )
  }
}

export default withRouter(Dashboard)

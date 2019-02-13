import { withRouter } from 'react-router-dom'
import { Button, Code } from '@blueprintjs/core'

@withRouter
export class Dashboard extends React.PureComponent {
  constructor() {
    super()
    this.goHome = this.goHome.bind(this)
  }

  goHome() {
    this.props.history.push('/')
  }

  public render() {
    // TODO: dex account customization/configuration
    return (
      <div>
        <h3>dex account customization/configuration</h3>
        <ul>
          <li>Customize Name</li>
          <li>Change Address</li>
          <li>Change DEX Rate</li>
          <li>Change Logo</li>
          <li>Deactivate!</li>
        </ul>
      </div>
    )
  }
}

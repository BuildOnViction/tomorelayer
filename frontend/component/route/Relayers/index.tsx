import { H3, Navbar, Icon } from '@blueprintjs/core'
import { Divider, Grid } from '@utility'
import RelayerList from './RelayerList'
/* import RelayerRegistration from './RelayerRegistration' */

// NOTE: we need 2 main components switching places
// one is Current relayer list (url, name, logo, start-date, status)
// one for Registration
const { Group } = Navbar

enum ActiveView {
  List = 'Relayer List',
  Form = 'Relayer Registration',
}

export class Relayers extends React.Component {
  state = {
    active: ActiveView.List
  }

  switchView = active => () => this.setState({ active })

  render() {
    const { active } = this.state
    return (
      <React.Fragment>
        <Grid className="justify-space-between align-start">
          <div className="col-5">
            <H3 className="text-dark">
              {active.toString().toUpperCase()}
            </H3>
          </div>
          <a
            className="col-2 text-center relayer-register-button mr-1"
            onClick={this.switchView(ActiveView.Form)}
          >
            Become a Relayer
          </a>
        </Grid>
        <Divider />
        {active === ActiveView.List && <RelayerList />}
      </React.Fragment>
    )
  }
}

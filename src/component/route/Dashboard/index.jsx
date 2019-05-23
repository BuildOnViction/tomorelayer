import React from 'react'
import { connect } from 'redux-zero/react'


class Dashboard extends React.Component {
  render() {
    const { relayers, match } = this.props
    return (
      <div>
        {relayers[match.params.relayerIdx].name}
      </div>
    )
  }
}

const mapProps = state => ({
  relayers: state.User.relayers
})

export default connect(mapProps)(Dashboard)

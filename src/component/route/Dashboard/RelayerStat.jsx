import React from 'react'
import { connect } from '@vutr/redux-zero/react'

const RelayerHome = ({ relayers, match }) => {
  const coinbase = match.params.coinbase
  const activeRelayer = relayers[coinbase]
  return (
    <div>
      Dashboard of Relayer {activeRelayer.name}
    </div>
  )
}

const mapProps = state => ({
  relayers: state.derived.userRelayers
})

export default connect(mapProps)(RelayerHome)

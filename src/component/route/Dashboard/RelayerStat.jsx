import React from 'react'

const RelayerHome = ({ relayers, match }) => {
  const coinbase = match.params.coinbase
  const activeRelayer = relayers[coinbase]
  return (
    <div>
      Dashboard of Relayer {activeRelayer.name}
    </div>
  )
}

export default RelayerHome

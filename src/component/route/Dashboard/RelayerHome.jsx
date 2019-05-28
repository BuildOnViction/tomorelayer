import React from 'react'
import { connect } from '@vutr/redux-zero/react'
// import { Container, Grid } from 'component/utility'

const RelayerHome = ({ relayer }) => {
  return (
    <div>
      Dashboard of Relayer {relayer.name}
    </div>
  )
}

const mapProps = state => ({

})

export default connect(mapProps)(RelayerHome)

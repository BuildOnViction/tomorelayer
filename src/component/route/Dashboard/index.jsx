import React from 'react'
import { connect } from 'redux-zero/react'
import { Container, Grid } from 'component/utility'
import TabMenu from './TabMenu'
import { $changeTab } from './actions'

const Dashboard = props => {
  const { relayers, match } = props
  return (
    <Container full>
      <TabMenu />
      <Grid className="mt-1 row">
        <div className="col-12">
          {relayers[match.params.relayerIdx].name}
        </div>
      </Grid>
    </Container>
  )
}

const mapProps = state => ({
  relayers: state.User.relayers,
})

export default connect(mapProps, { $changeTab })(Dashboard)

import React from 'react'
import { connect } from 'redux-zero/react'
import { Box } from '@material-ui/core'
import TabMenu from './TabMenu'
import RelayerStat from './RelayerStat'
import RelayerConfig from './RelayerConfig'
import FeedBack from './FeedBack'


const Dashboard = ({
  relayers,
  match,
}) => {

  const [tabValue, changeTabValue] = React.useState(0)
  const switchTab = (event, newValue) => changeTabValue(newValue)
  const relayer = relayers[match.params.coinbase] || relayers[0]

  return (
    <Box style={{ transform: 'translateY(-30px)' }}>
      <TabMenu onChange={switchTab} value={tabValue} />
      <Box className="mt-2">
        {tabValue === 0 && <RelayerStat relayer={relayer} />}
        {tabValue === 1 && <RelayerConfig relayer={relayer} />}
        {tabValue === 2 && <FeedBack />}
      </Box>
    </Box>
  )
}

const mapProps = state => ({
  relayers: state.user.relayers
})

export default connect(mapProps)(Dashboard)

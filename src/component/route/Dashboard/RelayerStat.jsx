import React from 'react'
import {
  Avatar,
  Box,
  Grid,
  Typography,
} from '@material-ui/core'
import cx from 'classnames'
import { withStyles } from '@material-ui/styles'
import placeholder from 'asset/image-placeholder.png'
import { StyledLink } from 'component/shared/Adapters'
import { isEmpty, TabMap } from 'service/helper'
import TableControl from 'component/shared/TableControl'
import StatCard from './StatCard'
import TimeVolumeStat from './TimeVolumeStat'
import OrderTable from './OrderTable'

const StyledAvatar = withStyles(theme => ({
  root: {
    height: 60,
    width: 60,
    borderRadius: '50%',
    marginRight: 20,
    '&.empty-avatar': {
      border: `solid 2px ${theme.palette.paper}99`,
      padding: 15,
    }
  }
}))(Avatar)

const TOPICS = new TabMap('Orders', 'Tokens')

export default class RelayerStat extends React.Component {
  state = {
    tab: TOPICS.orders,
  }

  onTabChange = (_, tab) => this.setState({ tab: TOPICS[tab] })

  render() {
    const {
      relayers: allRelayers,
      match,
    } = this.props

    const {
      tab,
    } = this.state

    const coinbase = match.params.coinbase
    const relayer = allRelayers[coinbase]

    const avatarClassName = cx({ 'empty-avatar': isEmpty(relayer.logo) })

    return (
      <Grid container direction="column" spacing={4}>
        <Grid item>
          <Box display="flex" alignItems="center">
            <Box>
              <StyledAvatar src={relayer.logo || placeholder} alt={relayer.name} className={avatarClassName} />
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="h6" className="mb-0">
                  {relayer.name}
                </Typography>
              </Box>
              <Box>
                {!isEmpty(relayer.link) && (
                  <StyledLink href={relayer.link} rel="noopener noreferrer" target="_blank">
                    {relayer.link}
                  </StyledLink>
                )}
              </Box>
            </Box>
          </Box>
        </Grid>
        <Grid item container spacing={3}>
          <Grid item container xs={12} sm={4} md={3} spacing={3} direction="column">
            <Grid item>
              <StatCard icon="https://picsum.photos/100/100" stat="1000" helpText="trades" />
            </Grid>
            <Grid item>
              <StatCard icon="https://picsum.photos/100/100" stat="1000" helpText="trades" />
            </Grid>
            <Grid item>
              <StatCard icon="https://picsum.photos/100/100" stat="1000" helpText="trades" />
            </Grid>
          </Grid>
          <Grid item xs={12} sm={8} md={9} className="pr-0">
            <TimeVolumeStat />
          </Grid>
        </Grid>
        <Grid item className="mt-1">
          <TableControl tabValue={TOPICS.getIndex(tab)} onTabChange={this.onTabChange} topics={TOPICS.values} />
          <Box className="mt-2">
            {tab === TOPICS.orders && <OrderTable />}
          </Box>
        </Grid>
      </Grid>
    )
  }
}

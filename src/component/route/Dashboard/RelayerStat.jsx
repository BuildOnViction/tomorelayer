import React from 'react'
import {
  Avatar,
  Box,
  Grid,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { StyledLink } from 'component/shared/Adapters'

const StyledAvatar = withStyles(theme => ({
  root: {
    height: 60,
    width: 60,
    borderRadius: '50%',
    margin: 20,
  }
}))(Avatar)


export default class RelayerStat extends React.Component {

  render() {
    const {
      relayers: allRelayers,
      match,
    } = this.props

    const coinbase = match.params.coinbase
    const relayer = allRelayers[coinbase]

    return (
      <Grid container direction="column">
        <Grid item>
          <Box display="flex" alignItems="center">
            <Box>
              <StyledAvatar src={relayer.logo} alt={relayer.name} />
            </Box>
            <Box display="flex" flexDirection="column">
              <Box>
                <Typography variant="h6">
                  {relayer.name}
                </Typography>
              </Box>
              <Box>
                <StyledLink href={relayer.link} rel="noopener noreferrer" target="_blank">
                  {relayer.link}
                </StyledLink>
              </Box>
            </Box>
          </Box>
        </Grid>
      </Grid>
    )
  }
}

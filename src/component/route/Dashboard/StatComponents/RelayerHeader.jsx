import React from 'react'
import cx from 'classnames'
import {
  Avatar,
  Box,
  Grid,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import { StyledLink } from 'component/shared/Adapters'
import placeholder from 'asset/image-placeholder.png'

const StyledAvatar = withStyles(theme => ({
  root: {
    height: 60,
    width: 60,
    borderRadius: '50%',
    marginRight: 20,
    '&.empty-avatar': {
      border: `solid 3px ${theme.palette.paper}`,
      padding: 20,
      background: `${theme.palette.paper}80`
    }
  }
}))(Avatar)


const RelayerHeader = ({ relayer }) => {

  const avatarClassName = cx({ 'empty-avatar': (!relayer.logo || relayer.logo === '') })

  return (
    <Grid item xs={12}>
      <Box display="flex" alignItems="center">
        <Box>
          <StyledAvatar src={relayer.logo || placeholder} alt={relayer.name} className={avatarClassName} />
        </Box>
        <Box display="flex" flexDirection="column">
          <Box>
            <Typography variant="h6" className="mb-0">
              {relayer.name || relayer.coinbase}
            </Typography>
          </Box>
          <Box>
            {relayer.link && relayer.link !== '' && (
              <StyledLink href={relayer.link} rel="noopener noreferrer" target="_blank">
                {relayer.link}
              </StyledLink>
            )}
          </Box>
        </Box>
      </Box>
    </Grid>
  )
}

export default RelayerHeader

import React from 'react'
import { Container, Grid, Typography } from '@material-ui/core'
import { StyledLink } from 'component/shared/Adapters'

export default class FeedBack extends React.Component {

  render() {

    return (
      <Container maxWidth="sm" className="pt-2" style={{ height: '60vh' }}>
        <Grid container justify="center">

          <Grid item xs={12}>
            <Typography variant="h5">
              Send your feedback
            </Typography>
          </Grid>

          <Grid item xs={12} container justify="center">
            <Typography variant="body2" style={{ lineHeight: 1.6 }}>
              If you have any concerns or feedback about <b>TomoRelayer</b>, please send an email to <StyledLink href="mailto:admin@tomochain.com">TomoChain Admin Email</StyledLink>.
            </Typography>
          </Grid>

        </Grid>
      </Container>
    )
  }
}

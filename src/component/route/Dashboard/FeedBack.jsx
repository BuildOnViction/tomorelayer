import React from 'react'
import {
  Button,
  Container,
  Grid,
  Paper,
  Typography,
  InputBase,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'


const CustomTextInput = withStyles(theme => {
  return {
    root: {
      color: `${theme.overrides.MuiTypography.root.color} !important`,
      padding: 7,
    },
  }
})(props => (
  <InputBase
    {...props}
    multiline
    rows={10}
    fullWidth
  />
))

export default class FeedBack extends React.Component {
  render() {
    return (
      <Container maxWidth="sm" className="pt-2">
        <Grid container justify="center" spacing={3}>

          <Grid item xs={12}>
            <Typography variant="h5">
              Send your feedback
            </Typography>
          </Grid>

          <Grid item xs={12}>
            <Paper elevation={0} className="p-1">
              <CustomTextInput />
            </Paper>
          </Grid>

          <Grid item xs={12} container justify="center" className="mt-2">
            <Typography variant="body1">
              Your feedback will be sent to Relayer product development team.
            </Typography>
          </Grid>

          <Grid item xs={12} container justify="space-around">
            <Button variant="contained" color="secondary">Cancel</Button>
            <Button variant="contained">Submit</Button>
          </Grid>

        </Grid>
      </Container>

    )
  }
}

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
    rowsMax={10}
    fullWidth
    placeholder="Enter your feedback here..."
  />
))

const MAX_CHAR = 400

export default class FeedBack extends React.Component {
  state = {
    content: '',
  }

  inputHandler = e => {
    const { content } = this.state
    const maxCharExceeded = content.length >= MAX_CHAR && e.target.value.length >= MAX_CHAR

    if (maxCharExceeded) {
      return undefined
    }

    return this.setState({ content: e.target.value })
  }

  render() {
    return (
      <Container maxWidth="sm" className="pt-2">
        <Grid container justify="center" spacing={2}>

          <Grid item xs={12}>
            <Typography variant="h5">
              Send your feedback
            </Typography>
          </Grid>

          <Grid item xs={12} container spacing={1}>
            <Grid item xs={12}>
              <Paper elevation={0} className="p-1">
                <CustomTextInput onChange={this.inputHandler} value={this.state.content} />
              </Paper>
            </Grid>
            <Grid item container justify="flex-end">
              <Typography variant="subtitle2">
                {this.state.content.length} / {MAX_CHAR} chars
              </Typography>
            </Grid>
          </Grid>

          <Grid item xs={12} container justify="center" className="mt-1 p-1">
            <Typography variant="body1">
              Your feedback will be sent to Relayer product development team.
            </Typography>
          </Grid>

          <Grid item xs={12} container justify="space-around" spacing={3}>
            <Grid item xs={6} container justify="center">
              <Button variant="contained" color="secondary">
                Cancel
              </Button>
            </Grid>
            <Grid item xs={6} container justify="center">
              <Button variant="contained">
                Submit
              </Button>
            </Grid>
          </Grid>

        </Grid>
      </Container>

    )
  }
}

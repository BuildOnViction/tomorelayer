import React from 'react'
// import cx from 'classnames'
import {
//   Avatar,
  Box,
  Button,
  Container,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
// import { withStyles } from '@material-ui/styles'
import { StyledLink } from 'component/shared/Adapters'

/*
   import TextIcon from '@material-ui/icons/TextRotationNone'
   import WebIcon from '@material-ui/icons/Web'
   import ImageIcon from '@material-ui/icons/InsertPhoto'
 */
import { connect } from 'redux-zero/react'
// import placeholder from 'asset/image-placeholder.png'
// import { compose, isEmpty } from 'service/helper'
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'

/* const StyledAvatar = withStyles(theme => ({
  root: {
    width: '100%',
    height: '100%',
    '&.empty-avatar': {
      backgroundColor: `${theme.palette.paper}CC`,
      padding: 40,
    }
  }
}))(Avatar) */

class FormInfo extends React.Component {

  state = {
    open: false,
  }

  openConfirmDiaglog = () => this.setState({ open: !this.state.open })

  handleClose = () => this.setState({ open: false })

  confirmAndSubmit = async () => {
    await this.props.submitForm()
    this.setState({ open: false })
  }

  render() {
    const { open } = this.state
    const {
      values,
      errors,
      handleChange,
      isSubmitting,
      relayer,
    } = this.props

    const inputDisabled = isSubmitting || relayer.resigning

    // const avatarClassName = cx('mr-1', { 'empty-avatar': isEmpty(values.logo) })

    return (
      <Container>
        {relayer.resigning && (
          <Box>
            <Typography component="h4">
              This relayer has been requested to deactivated. Updating relayer is no longer allowed.
            </Typography>
          </Box>
        )}
        <form>
          <Grid item container spacing={6} direction="column">
            {/* <Grid item container>
              <Grid item sm={6} md={4} className="pr-2">
                <StyledAvatar alt={values.name} src={values.logo || placeholder} className={avatarClassName} />
              </Grid>
              <Grid item sm={6} md={8} container direction="column" spacing={2}>
                <Grid item>
                  <TextField
                    label="Logo"
                    value={values.logo || ''}
                    onChange={handleChange}
                    error={Boolean(errors.logo)}
                    id="relayer-logo"
                    name="logo"
                    variant="outlined"
                    helperText={errors.logo && <i className="text-alert">{errors.logo}</i>}
                    disabled={inputDisabled}
                    fullWidth
                  />
                </Grid>
                <Grid item>
                  <div>Ratio: 1:1</div>
                  <div>Recommended size 300x300</div>
                </Grid>
              </Grid>
            </Grid> */}
            <Grid item>
              <TextField
                label="Relayer Address (coinbase)"
                value={values.coinbase}
                id="relayer-name"
                inputProps={{ readOnly: true }}
                name="coinbase"
                variant="outlined"
                fullWidth
              />
              <Typography variant="subtitle2" className="mt-1">
                {'Your relayer identity'}
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Name"
                value={values.name || ''}
                onChange={handleChange}
                error={Boolean(errors.name) && <i className="text-alert">{errors.name}</i>}
                id="relayer-name"
                name="name"
                variant="outlined"
                disabled={inputDisabled}
                fullWidth
              />
              <Typography variant="subtitle2" className="mt-1">
                {errors.name || 'Max 200 chars'}
              </Typography>
            </Grid>
            <Grid item>
              <TextField
                label="Url"
                value={values.link || ''}
                id="relayer-link"
                name="link"
                onChange={handleChange}
                error={Boolean(errors.link)}
                variant="outlined"
                helperText={errors.link && <i className="text-alert">{errors.link}</i>}
                disabled={inputDisabled}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Typography component="div" variant="body2" style={{ lineHeight: 1.5 }}>
                To launch your own DEX using TomoX-SDK, follow this <StyledLink href="https://docs.tomochain.com/masternode/tomox-sdk/" rel="noopener noreferrer" target="_blank">link</StyledLink> for detailed instructions.<br />
                If you need to have a consultant from <b>TomoChain Enterprise</b> team, please send an email to <StyledLink href="mailto:admin@tomochain.com">admin@tomochain.com</StyledLink>.
              </Typography>
            </Grid>
            <Grid item container justify="center">
              <Button color="primary" variant="contained" onClick={this.openConfirmDiaglog} type="button">
                Save
              </Button>
            </Grid>
          </Grid>
          <Dialog open={open} onClose={this.handleClose}>

            <DialogTitle id="alert-dialog-title" className="text-center">
              Preview and Confirm
            </DialogTitle>

            <Divider />

            <DialogContent className="mt-2" style={{ maxWidth: '80vw', width: 600 }}>
              <Box display="flex">
                <Box flexGrow={1} className="mr-1">
                  <Typography variant="body1">
                    Relayer Name
                  </Typography>
                  <Typography variant="body1">
                    Dex URL
                  </Typography>
                  <Typography variant="body1">
                    Dex Logo URL
                  </Typography>
                </Box>

                <Box flexGrow={3}>
                  <Typography variant="body2">
                    {values.name}
                  </Typography>
                  <Typography variant="body2">
                    {values.link}
                  </Typography>
                  <Typography variant="body2">
                    {values.logo}
                  </Typography>
                </Box>
              </Box>

            </DialogContent>
            <Box display="flex" justifyContent="space-between" className="p-1 mt-2">
              <Button onClick={this.handleClose} color="primary" size="small" type="button" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button color="primary" variant="contained" size="small" onClick={this.confirmAndSubmit} disabled={isSubmitting}>
                Accept
              </Button>
            </Box>
          </Dialog>
        </form>
      </Container>
    )
  }
}

const mapProps = undefined
const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.infoForm
export default compose(formConnect, storeConnect)(FormInfo)

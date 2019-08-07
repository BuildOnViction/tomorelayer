import React from 'react'
import { connect } from 'redux-zero/react'
import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@material-ui/core'
import InfoIcon from '@material-ui/icons/Info'
import { withStyles } from '@material-ui/styles'
import { Logout as confirmLogout } from 'component/shared/actions'

const StyledIcon = withStyles(theme => ({
  root: {
    color: theme.palette.link,
    marginTop: 7,
  }
}))(InfoIcon)

const StyledItemText = withStyles(theme => ({
  primary: {
    color: theme.palette.subtitle,
  }
}))(ListItemText)

const HelpTexts = [
  'If you are using MetaMask and want to change your account, you can just change the account with MetaMask. The current working session will automatically adjust to your changes'
]

const LogoutPage = ({
  confirmLogout,
}) => (
  <Container maxWidth="sm" className="mt-5">
    <Paper className="p-1" elevation={0}>
      <Box display="flex" flexDirection="column">
        <Typography variant="h6" className="mt-1 text-center">
          Are you sure you want to log out?
        </Typography>
        <Box>
          <List>
            {HelpTexts.map(t => (
              <ListItem key={t} alignItems="flex-start">
                <ListItemIcon>
                  <StyledIcon />
                </ListItemIcon>
                <StyledItemText primary={t} />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box className="m-2" display="flex" justifyContent="center">
          <Button variant="contained" color="primary" onClick={confirmLogout}>
            Confirm
          </Button>
        </Box>
      </Box>
    </Paper>
  </Container>
)


const mapProps = undefined

const actions = {
  confirmLogout,
}

export default connect(mapProps, actions)(LogoutPage)

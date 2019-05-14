import React from 'react'
import { withFormik } from 'formik'
import { connect } from 'redux-zero/react'
import {
  Button,
  Checkbox,
  List,
  ListItemText,
  ListItemSecondaryAction,
  ListItem,
  ListItemAvatar,
  ListSubheader,
  Avatar,
  InputAdornment,
  TextField,
  Typography,
  Radio,
} from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import { Grid } from 'component/utility'
import { $backOneStep, $submitFormPayload } from './actions'

const FormStepFour = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    tradableTokens,
  } = props
  return (
    <form onSubmit={handleSubmit} className="text-left">
      <h1 className="register-form--title">
        Choose Trading Pairs of Token
      </h1>
      <div className="row mt-1">
        <div className="col-4 p-0">
          <List dense className="border-all token-list bg-filled pt-0">
            <ListSubheader className="border-bottom p-1">
              <TextField
                label="Search"
                type="text"
                variant="outlined"
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </ListSubheader>
            {tradableTokens.map((token, idx) => (
              <ListItem key={token.id} button>
                <ListItemAvatar>
                  <Avatar
                    alt={token.name}
                    src={token.logo}
                  />
                </ListItemAvatar>
                <ListItemText primary={token.symbol} />
                <ListItemSecondaryAction>
                  <Radio color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="col-4 p-0">
          <List dense className="border-all token-list bg-filled pt-0">
            <ListSubheader className="border-bottom p-1">
              <TextField
                label="Search"
                type="text"
                variant="outlined"
                margin="dense"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                fullWidth
              />
            </ListSubheader>
            {tradableTokens.map((token, idx) => (
              <ListItem key={token.id} button>
                <ListItemAvatar>
                  <Avatar
                    alt={token.name}
                    src={token.logo}
                  />
                </ListItemAvatar>
                <ListItemText primary={token.symbol} />
                <ListItemSecondaryAction>
                  <Checkbox />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="col-2 text-center">
          <Button variant="contained" color="primary" size="small">Add</Button>
        </div>
        <div className="col-2 p-0">
          <List dense className="border-all token-list bg-filled pt-0">
            <ListSubheader className="border-bottom p-1">
              <Typography component="h4">
                Selected Pairs
              </Typography>
            </ListSubheader>
            <ListItem>1</ListItem>
            <ListItem>2</ListItem>
            <ListItem>3</ListItem>
            <ListItem>4</ListItem>
            <ListItem>5</ListItem>
            <ListItem>1</ListItem>
            <ListItem>2</ListItem>
            <ListItem>3</ListItem>
            <ListItem>4</ListItem>
            <ListItem>5</ListItem>
          </List>
        </div>
      </div>
      <div className="col-8 border-all">
        <Grid className="align-baseline pl-1">
          <Button type="button" className="mr-2">
            Add Custom Token
          </Button>
          <TextField
            placeholder="Token address..."
            type="text"
            variant="outlined"
            margin="dense"
          />
        </Grid>
      </div>
      <Grid className="justify-space-between m-0 mt-2">
        <Button variant="outlined" className="mr-1" onClick={props.$backOneStep} type="button">
          Back
        </Button>
        <Button color="primary" variant="contained" type="submit">
          Confirm
        </Button>
      </Grid>
    </form>
  )
}

const FormikWrapper = withFormik({
  validateOnChange: false,
  validate: values => {
    const errors = {}
    return errors
  },

  handleSubmit: (values, { props }) => {
    props.$submitFormPayload({
      fromTokens: values.fromTokens,
      toTokens: values.toTokens,
    })
  },

  displayName: 'FormStepFour',
})(FormStepFour)

const storeConnect = connect(
  state => ({
    fromTokens: state.RelayerForm.relayer_meta.fromTokens,
    toTokens: state.RelayerForm.relayer_meta.toTokens,
    tradableTokens: state.tradableTokens,
  }),
  {
    $submitFormPayload,
    $backOneStep,
  },
)

export default storeConnect(FormikWrapper)

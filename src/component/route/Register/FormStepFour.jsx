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
  Avatar,
  InputAdornment,
  TextField,
  Typography,
  Radio,
} from '@material-ui/core'
import { Grid } from 'component/utility'
import { $backOneStep, $submitFormPayload } from './actions'

const FormStepFour = props => {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
  } = props
  return (
    <form onSubmit={handleSubmit} className="text-left">
      <h1 className="register-form--title">
        Choose Trading Pairs of Token
      </h1>
      <div className="row mt-1">
        <div className="col-6">
          <List dense className="border-all token-list">
            {new Array(10).fill('a').map(value => (
              <ListItem key={value} button>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText primary={`Line item ${value + 1}`} />
                <ListItemSecondaryAction>
                  <Radio color="primary" />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div className="col-6">
          <List dense className="border-all token-list">
            {new Array(10).fill('a').map(value => (
              <ListItem key={value} button>
                <ListItemAvatar>
                  <Avatar
                    alt={`Avatar n°${value + 1}`}
                    src={`/static/images/avatar/${value + 1}.jpg`}
                  />
                </ListItemAvatar>
                <ListItemText primary={`Line item ${value + 1}`} />
                <ListItemSecondaryAction>
                  <Checkbox />
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <Grid className="justify-space-between m-0">
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
  }),
  {
    $submitFormPayload,
    $backOneStep,
  },
)

export default storeConnect(FormikWrapper)

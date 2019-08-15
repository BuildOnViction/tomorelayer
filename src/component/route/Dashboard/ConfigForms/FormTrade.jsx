import React from 'react'
import {
  Button,
  Container,
  Grid,
  TextField,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import FeedIcon from '@material-ui/icons/RssFeed'
import { connect } from 'redux-zero/react'
import { compose, isEmpty } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { notifyDex } from 'service/backend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'
import TokenPairList from 'component/shared/TokenPairList'

const MenuButton = withStyles(theme => ({
  root: {
    textTransform: 'none',
    color: theme.palette.subtitle,
    padding: 0,
    margin: 0,
    fontSize: 14,
    '&:hover': {
      background: 'none',
      color: theme.palette.maintitle,
    },
    '&:active': {

    }
  }
}))(props => {
  return (
    <Button {...props} size="small" >
      {props.text} <FeedIcon style={{ marginLeft: 5, fontSize: 16 }} />
    </Button>
  )
})


const FormTrade = ({
  values,
  errors,
  handleChange,
  handleSubmit,
  isSubmitting,
  setFieldValue,
  relayer,
}) => {

  const [isNotifying, setIsNotifying] = React.useState(false)

  const setPairsValues = pairs => {
    setFieldValue('from_tokens', pairs.map(p => p.from.address))
    setFieldValue('to_tokens', pairs.map(p => p.to.address))
  }

  const handleNotify = async () => {
    if (isEmpty(relayer.link)) {
      return undefined
    }

    setIsNotifying(true)
    await notifyDex(relayer.link)
    setIsNotifying(false)
  }

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <Grid item container direction="column" spacing={8}>
          <Grid item>
            <TextField
              label="Choose Trade Fee (min: 0.1%, max: 99.9%)"
              name="trade_fee"
              id="trade_fee-input"
              value={values.trade_fee}
              onChange={handleChange}
              error={errors.trade_fee}
              type="number"
              variant="outlined"
              inputProps={{
                step: 0.01,
                max: 99.99,
                min: 0.01,
              }}
              fullWidth
              disabled={isSubmitting}
              InputProps={{
                endAdornment: '%'
              }}
            />
          </Grid>
          <Grid item container direction="column" spacing={1}>
            <Grid item container justify="space-between" alignItems="center">
              <Typography variant="body1" className="m-0">
                Set trade Tokens
              </Typography>
              {!isEmpty(relayer.link) && (
                <MenuButton
                  text={isNotifying ? 'Notifying...' : 'NotifyDex'}
                  onClick={handleNotify}
                />
              )}
            </Grid>
            <Grid item>
              <TokenPairList
                value={values}
                onChange={setPairsValues}
                disabled={isSubmitting}
                viewOnly={relayer.resigning}
              />
            </Grid>
          </Grid>
          <Grid item container justify="center">
            <Button color="primary" variant="contained" type="submit" disabled={isSubmitting} data-testid="save-button">
              Save
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  )
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.tradeForm
export default compose(formConnect, storeConnect)(FormTrade)

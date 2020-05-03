import React from 'react'
import {
  Checkbox,
  Container,
  Grid,
  TextField,
  FormControlLabel,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { connect } from 'redux-zero/react'
import { compose } from 'service/helper'
import { PushAlert } from 'service/frontend'
import { UpdateRelayer } from '../actions'
import { wrappers } from './forms'
import { lendingInfo, lendingPairs } from 'service/blockchain'

const SmallCheckbox = withStyles(theme => ({
  root: {
    color: theme.palette.maintitle,
    height: 5,
    width: 5,
    marginLeft: 10,
    marginTop: -15,
    opacity: .3,
    '& svg': {
      fontSize: '1rem',
    }
  },
  checked: {
    opacity: 1,
    '& svg': {
      color: theme.palette.link,
    }
  },
  disabled: {
    opacity: 1,
    color: `${theme.palette.maintitle}33 !important`,
  }
}))(Checkbox)

class FormLend extends React.Component {

  constructor(props) {
    super(props)

    this.state = {
      lendingTradeFee: 0,
    }
  }

  async componentDidMount() {
    let { terms, bases } = await lendingPairs(this.props.relayer.coinbase)
    let lending = await lendingInfo(this.props.relayer.coinbase)
    let pairs = []
    terms.forEach(t => {
      bases.forEach(b => {
        let c = false

        for (let i in lending.lendingTokens) {
          c = (lending.lendingTokens[i] === b) && (lending.lendingTerms[i] === t)
          if (c === true) {
            break
          }
        }
        pairs.push({ t, b, c })
      })
    })
    this.setState( { ...lending, pairs })
  }
    
  render() {

    const {
      errors,
      handleChange,
      handleSubmit,
      isSubmitting,
    } = this.props
    const { lendingTradeFee, pairs } = this.state

    const handleCheck = (event) => {
      pairs[event.target.value].c = !pairs[event.target.value].c
      this.setState({ ...this.state })
    }


    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid item container direction="column" spacing={8}>
            <Grid item>
              <TextField
                label="Choose Lending Fee (min: 0%, max: 10%)"
                name="trade_fee"
                id="trade_fee-input"
                value={lendingTradeFee}
                onChange={handleChange}
                error={errors.trade_fee}
                type="number"
                variant="outlined"              
                fullWidth
                disabled={isSubmitting}
                InputProps={{
                  endAdornment: '%',
                  inputProps: {
                    step: 0.01,
                    max: 10,
                    min: 0,
                  }
                }}
              />
            </Grid>
            <Grid item>
              {(pairs|| []).map((p, i) => (<FormControlLabel
                control={<SmallCheckbox checked={p.c} onChange={handleCheck} value={i} />}
                label={p.t + '/' + p.b}
              />))}

            </Grid>
            <Grid item container justify="center">
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}

const mapProps = state => ({
  RelayerContract: state.blk.RelayerContract
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.lendForm
export default compose(formConnect, storeConnect)(FormLend)

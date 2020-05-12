import React from 'react'
import {
  Checkbox,
  Container,
  Grid,
  TextField,
  FormControlLabel,
  CircularProgress,
  Box,
  Button
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
    marginRight: 5,
    marginTop: -17,
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
    this.props.setSubmitting(true)
    this.forceUpdate()
    let db = await this.props.pouch.find({
      selector: { }
    })

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
        let cl = '0x0000000000000000000000000000000000000000'
        pairs.push({ t, b, c, cl })
      })
    })
    pairs.forEach(p => {
      db.docs.forEach(d => {
        if (p.b.toLowerCase() === (d.address || '').toLowerCase()) {
          p.symbol = d.symbol
          p.name = String(Math.floor(parseInt(p.t, 10) / (24 * 60 * 60))) + 'DAY/' + d.symbol
          return true
        }
      })
    })
    this.setState( { lending, pairs })
    this.props.setSubmitting(false)
    this.forceUpdate()
  }
    
  render() {
    const {
      values,
      errors,
      handleSubmit,
      isSubmitting,
    } = this.props
    const { lending, pairs } = this.state
    values.lending_fee = (lending || {}).lendingTradeFee || 0
    values.pairs = pairs

    const handleCheck = (event) => {
      pairs[event.target.value].c = !pairs[event.target.value].c
      this.setState({ ...this.state })
    }

    const handleChange = (event) => {
      values.lending_fee = event.target.value
      lending.lendingTradeFee = event.target.value
      this.setState({ ...this.state })
    }


    return (
      <Container>
        <form onSubmit={handleSubmit}>
          <Grid item container direction="column" spacing={8}>
            <Grid item>
              <TextField
                label="Choose Lending Fee (min: 0%, max: 10%)"
                name="lending_fee"
                id="lending_fee-input"
                value={values.lending_fee}
                onChange={handleChange}
                error={errors.lending_fee}
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
                label={p.name}
              />))}

            </Grid>
            <Grid item container justify="center">
              {isSubmitting && (
                <Box display="flex" alignItems="center" className="pr-1">
                  <span className="mr-1">Requesting...</span>
                  <CircularProgress style={{ width: 20, height: 20 }}/>
                </Box>)}

              {!isSubmitting && (

                <Button color="primary" variant="contained" type="submit" disabled={isSubmitting || !!errors.quoteToken} data-testid="save-button">
              Save
                </Button>
              )}
            </Grid>
          </Grid>
        </form>
      </Container>
    )
  }
}

const mapProps = state => ({
  LendingContract: state.blk.LendingContract,
  pouch: state.pouch
})

const actions = {
  UpdateRelayer,
  PushAlert,
}

const storeConnect = connect(mapProps, actions)
const formConnect = wrappers.lendForm
export default compose(formConnect, storeConnect)(FormLend)

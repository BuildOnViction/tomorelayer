import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { Button, Modal } from '@material-ui/core'
import AddCircleOutline from '@material-ui/icons/AddCircleOutline'
import { Container, Grid } from 'component/utility'
import { $addToken, $backOneStep, $submitFormPayload, $toggleCustomTokenForm } from './actions'
import FromTokenList from './FromTokenList'
import ToTokenList from './ToTokenList'
import PairList from './PairList'
import NewTokenForm from './NewTokenForm'


const NewTokenFormToggleButton = ({ onClick }) => (
  <Button color="default" onClick={onClick} size="small">
    <AddCircleOutline />
    Custom Token
  </Button>
)

class FormStepFour extends React.Component {
  state = {
    selectedFromToken: undefined,
    selectedToTokens: [],
    tokenPairs: [],
  }

  componentDidMount() {
    const tokenPairs = this.props.fromTokens.map((t, idx) => ({
      from: t,
      to: this.props.toTokens[idx],
    }))
    this.setState({ tokenPairs })
  }

  changeFromToken = id => () => {
    this.setState({ selectedFromToken: id, selectedToTokens: [] })
  }

  changeToTokens = id => {
    const set = new Set(this.state.selectedToTokens)
    set.has(id) ? set.delete(id) : set.add(id)
    const selectedToTokens = Array.from(set)
    this.setState({ selectedToTokens })
  }

  addPairs = () => {
    const {
      selectedToTokens,
      selectedFromToken,
      tokenPairs,
    } = this.state

    const { tradableTokens } = this.props
    const newPairs = Array.from(tokenPairs)
    selectedToTokens.filter(toTokenAddr => {
      const find = tokenPairs.find(pair => pair.from.id === selectedFromToken && pair.to.id === toTokenAddr)
      return !find
    }).forEach(tk => newPairs.push({
      from: tradableTokens.find(t => t.id === selectedFromToken),
      to: tradableTokens.find(t => t.id === tk)
    }))
    this.setState({ tokenPairs: newPairs })
  }

  removePair = pair => () => {
    const pairs = Array.from(this.state.tokenPairs)
    const idx = pairs.findIndex(p => p.from.id === pair.from.id && p.to.id === pair.to.id)
    pairs.splice(idx, 1)
    this.setState({ tokenPairs: pairs })
  }

  shouldDisable = toTokenId => {
    const { selectedFromToken, tokenPairs } = this.state
    const find = tokenPairs.find(t => t.from.id === selectedFromToken && t.to.id === toTokenId)
    return !!find
  }

  submitPairs = () => {
    const { tokenPairs } = this.state
    this.props.$submitFormPayload({
      fromTokens: tokenPairs.map(p => p.from),
      toTokens: tokenPairs.map(p => p.to),
    })
  }

  toggleNewTokenForm = () => {}

  render() {
    const {
      tradableTokens,
      tokenForm,
    } = this.props

    const {
      selectedFromToken,
      selectedToTokens,
      tokenPairs,
    } = this.state

    return (
      <div className="text-left">
        <h1 className="register-form--title">
          Choose Trading Pairs of Token
        </h1>
        <div className="row mt-1">
          <div className="col-3 p-0">
            <FromTokenList
              tokens={tradableTokens}
              selected={selectedFromToken}
              onChange={this.changeFromToken}
            />
          </div>
          <div className="col-3 p-0">
            <ToTokenList
              tokens={tradableTokens}
              selected={selectedToTokens}
              fromToken={selectedFromToken}
              onChange={this.changeToTokens}
              disabled={this.shouldDisable}
            />
          </div>
          <div className="col-2 text-center p-2">
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={this.addPairs}>
              Add
            </Button>
          </div>
          <div className="col-4 p-0">
            <PairList pairs={tokenPairs} removePair={this.removePair} />
          </div>
        </div>
        <div className="col-6 border-all">
          <NewTokenFormToggleButton onClick={this.props.$toggleCustomTokenForm} />
          {tokenForm && <NewTokenForm />}
        </div>

        <Grid className="justify-space-between m-0 mt-2">
          <Button variant="outlined" className="mr-1" onClick={this.props.$backOneStep} type="button">
            Back
          </Button>
          <Button color="primary" variant="contained" type="button" onClick={this.submitPairs}>
            Confirm
          </Button>
        </Grid>

      </div>
    )
  }
}

const mapProps = state => ({
  fromTokens: state.RelayerForm.relayer_meta.fromTokens,
  toTokens: state.RelayerForm.relayer_meta.toTokens,
  tradableTokens: state.tradableTokens,
  tokenForm: state.RelayerForm.tokenForm,
})

const actions = {
  $submitFormPayload,
  $backOneStep,
  $addToken,
  $toggleCustomTokenForm,
}

const storeConnect = connect(mapProps, actions)

export default storeConnect(FormStepFour)

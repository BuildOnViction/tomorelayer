import React from 'react'
import { Button } from '@material-ui/core'

export const MajorTokenSelect = ({ name, selected, onClick }) => (
  <Button size="small" color={selected ? 'primary' : 'default'} onClick={onClick}>
    {name}
  </Button>
)

export default class MajorTokenFilter extends React.Component {
  state = {
    tokens: []
  }

  pick = token => () => {
    const tokens = Array.from(this.state.tokens)
    const index = tokens.indexOf(token.address)
    if (index >= 0) {
      tokens.splice(index, 1)
    } else {
      tokens.push(token.address)
    }
    this.setState({ tokens }, () => this.props.setFilter(this.state.tokens))
  }

  render() {
    const majorTokens = this.props.majorTokens
    return (
      <React.Fragment>
        {majorTokens.map(tk => (
          <MajorTokenSelect
            name={tk.symbol}
            key={tk.symbol}
            onClick={this.pick(tk)}
            selected={this.state.tokens.includes(tk.address)}
          />
        ))}
      </React.Fragment>
    )
  }
}

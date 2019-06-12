import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Grid } from 'component/utility'
import RelayerInfoConfig from './subcomponents/RelayerInfoConfig'
import RelayerTradeConfig from './subcomponents/RelayerTradeConfig'

const ListItems = [
  'Information',
  'Trading Options',
  'Transfer',
  'Resign'
]

export default class ConfigureBoard extends React.Component {

  state = {
    activeConfig: 0,
  }

  changeConfigItem = activeConfig => () => this.setState({ activeConfig })

  render() {
    const { relayer } = this.props
    const { activeConfig } = this.state
    const isSelected = idx => idx === activeConfig

    return (
      <Grid className="row">
        <div className="col-3 pr-2">
          <List component="nav">
            {ListItems.map((item, idx) => (
              <ListItem key={item} button selected={isSelected(idx)} onClick={this.changeConfigItem(idx)}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="col-9">
          {activeConfig === 0 && <RelayerInfoConfig relayer={relayer} />}
          {activeConfig === 1 && <RelayerTradeConfig relayer={relayer} />}
        </div>
      </Grid>
    )
  }
}

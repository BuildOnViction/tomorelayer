import React from 'react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Grid } from 'component/utility'
import FormInfo from './ConfigForms/FormInfo'
import FormTrade from './ConfigForms/FormTrade'
import FormTransfer from './ConfigForms/FormTransfer'
import FormResign from './ConfigForms/FormResign'

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
          {activeConfig === 0 && <FormInfo relayer={relayer} />}
          {activeConfig === 1 && <FormTrade relayer={relayer} />}
          {activeConfig === 2 && <FormTransfer />}
          {activeConfig === 3 && <FormResign />}
        </div>
      </Grid>
    )
  }
}

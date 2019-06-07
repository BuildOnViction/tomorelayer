import React from 'react'
import { connect } from '@vutr/redux-zero/react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Grid } from 'component/utility'
import RelayerInfoConfig from './subcomponents/RelayerInfoConfig'
import RelayerTradeConfig from './subcomponents/RelayerTradeConfig'
import { $changeConfigItem } from './actions'

const ListItems = [
  'Information',
  'Trading Options',
  'Transfer',
  'Resign'
]

class ConfigureBoard extends React.Component {
  componentWillUnmount() {
    this.props.$changeConfigItem(0)
  }

  render() {
    const { activeConfig, relayer } = this.props
    const changeConfigItem = idx => () => this.props.$changeConfigItem(idx)
    const isSelected = idx => idx === activeConfig

    return (
      <Grid className="row">
        <div className="col-3 pr-2">
          <List component="nav">
            {ListItems.map((item, idx) => (
              <ListItem key={item} button selected={isSelected(idx)} onClick={changeConfigItem(idx)} disableRipple>
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

const mapProps = state => ({
  activeConfig: state.Dashboard.ConfigureBoard.activeConfig
})

export default connect(mapProps, { $changeConfigItem })(ConfigureBoard)
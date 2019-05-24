import React from 'react'
import { connect } from 'redux-zero/react'
import { List, ListItem, ListItemText } from '@material-ui/core'
import { Container, Grid } from 'component/utility'
import ConfigureBoardInfo from './subcomponents/ConfigureBoardInfo'
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
    const { relayer, activeConfigure } = this.props
    const changeConfigItem = idx => () => this.props.$changeConfigItem(idx)
    const isSelected = idx => idx === activeConfigure

    return (
      <Grid className="row">
        <div className="col-3 pr-2">
          <List component="nav">
            {ListItems.map((item, idx) => (
              <ListItem key={item} button selected={isSelected(idx)} onClick={changeConfigItem(idx)}>
                <ListItemText primary={item} />
              </ListItem>
            ))}
          </List>
        </div>
        <div className="col-9">
          {activeConfigure === 0 && <ConfigureBoardInfo relayer={relayer} />}
        </div>
      </Grid>
    )
  }
}

const mapProps = state => ({
  activeConfigure: state.Dashboard.ConfigureBoard.activeConfigure
})

export default connect(mapProps, { $changeConfigItem })(ConfigureBoard)

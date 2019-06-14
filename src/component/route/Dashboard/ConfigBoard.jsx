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

const ConfigBoard = () => {
  const [formstep, setFormstep] = React.useState(0)
  const changeForm = step => () => setFormstep(step)

  return (
    <Grid className="row">
      <div className="col-3 pr-2">
        <List component="nav">
          {ListItems.map((item, idx) => (
            <ListItem key={item} button selected={formstep === idx} onClick={changeForm(idx)}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </div>
      <div className="col-9">
        {formstep === 0 && <FormInfo />}
        {formstep === 1 && <FormTrade />}
        {formstep === 2 && <FormTransfer />}
        {formstep === 3 && <FormResign />}
      </div>
    </Grid>
  )
}

export default ConfigBoard

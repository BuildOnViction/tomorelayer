import React from 'react'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
} from '@material-ui/core'
import FormInfo from './ConfigForms/FormInfo'
import FormTrade from './ConfigForms/FormTrade'
/*
 * import FormTransfer from './ConfigForms/FormTransfer'
 * import FormResign from './ConfigForms/FormResign' */

const ListItems = [
  'Information',
  'Trade Options',
  'Transfer',
  'Resign'
]

const ConfigBoard = ({ match, relayers }) => {
  const [formstep, setFormstep] = React.useState(0)
  const changeForm = step => () => setFormstep(step)
  const relayer = relayers[match.params.coinbase]

  return (
    <Paper className="p-2">
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
          {formstep === 0 && <FormInfo relayer={relayer} />}
          {formstep === 1 && <FormTrade relayer={relayer} />}
          {/*
              {formstep === 2 && <FormTransfer relayer={relayer} />}
              {formstep === 3 && <FormResign relayer={relayer} />} */}
        </div>
      </Grid>
    </Paper>
  )
}

export default ConfigBoard

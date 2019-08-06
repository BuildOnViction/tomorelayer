import React from 'react'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import FormInfo from './ConfigForms/FormInfo'
import FormDeposit from './ConfigForms/FormDeposit'
import FormTrade from './ConfigForms/FormTrade'
import FormTransfer from './ConfigForms/FormTransfer'
import FormResign from './ConfigForms/FormResign'


const SIDE_MENU_ITEMS = {
  info: 'Information',
  trade: 'Trade Options',
  deposit: 'Deposit',
  transfer: 'Transfer',
  resign: 'Resign',
}

const NotExistRelayer = () => (
  <div className="col-9">
    Relayer doesnt exist/is already transfered or shut down.
  </div>
)

const ConfigBoard = ({ relayer }) => {
  const [formstep, setFormstep] = React.useState(SIDE_MENU_ITEMS.info)
  const changeForm = step => () => setFormstep(step)

  return (
    <Grid container className="relayer-config-container" spacing={6} justify="flex-start">
      <Grid item xs={12} sm={3} md={2} lg={3}>
        <List component="nav">
          {Object.values(SIDE_MENU_ITEMS).map((item, idx) => (
            <ListItem key={item} button selected={formstep === item} onClick={changeForm(item)}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>
      {!relayer.coinbase ? <NotExistRelayer /> : (
        <Grid item xs={12} sm={8} md={10} lg={6} className="mt-1">
          {formstep === SIDE_MENU_ITEMS.info && <FormInfo relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.trade && <FormTrade relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.deposit && <FormDeposit relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.transfer && <FormTransfer relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.resign && <FormResign relayer={relayer} />}
        </Grid>
      )}
    </Grid>
  )
}

export default ConfigBoard

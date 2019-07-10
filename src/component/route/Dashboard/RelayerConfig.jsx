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

const ConfigBoard = ({ match, relayers }) => {
  const [formstep, setFormstep] = React.useState(0)
  const changeForm = step => () => setFormstep(step)
  const nullRelayer = {
    coinbase: undefined,
    owner: undefined,
    maker_fee: undefined,
    taker_fee: undefined,
    from_tokens: [],
    to_tokens: [],
    link: undefined,
    logo: undefined,
    name: undefined,
  }
  const relayer = relayers[match.params.coinbase] || nullRelayer

  return (
    <Grid container className="relayer-config-container">
      <Grid item sm={4} md={3} className="pr-5">
        <List component="nav">
          {Object.values(SIDE_MENU_ITEMS).map((item, idx) => (
            <ListItem key={item} button selected={formstep === idx} onClick={changeForm(item)}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>
      {!relayer.coinbase ? <NotExistRelayer /> : (
        <Grid item xs={12} sm={8} md={6} className="mt-1">
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

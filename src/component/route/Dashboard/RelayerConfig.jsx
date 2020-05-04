import React from 'react'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import { withStyles } from '@material-ui/styles'
import FormInfo from './ConfigForms/FormInfo'
import FormDeposit from './ConfigForms/FormDeposit'
import FormTrade from './ConfigForms/FormTrade'
import FormLend from './ConfigForms/FormLend'
import FormTransfer from './ConfigForms/FormTransfer'
import FormResign from './ConfigForms/FormResign'

const StyledListItem = withStyles(theme => ({
  root: {
    borderRadius: 10,
    padding: '5px 5px 5px 45px',
    maxWidth: 200,
    marginBottom: 10,
    '&:hover': {
      backgroundColor: theme.palette.navItemSelected,
    },
  },
  selected: {
    backgroundColor: `${theme.palette.navItemSelected} !important`,
  },
}))(ListItem)

const SIDE_MENU_ITEMS = {
  info: 'Information',
  trade: 'Spot Options',
  lend: 'Lending Options',
  deposit: 'Deposit',
  transfer: 'Transfer',
  resign: 'Shutdown',
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
        <List>
          {Object.values(SIDE_MENU_ITEMS).map((item, idx) => (
            <StyledListItem key={item} button selected={formstep === item} onClick={changeForm(item)}>
              <ListItemText primary={item} />
            </StyledListItem>
          ))}
        </List>
      </Grid>
      {!relayer.coinbase ? <NotExistRelayer /> : (
        <Grid item xs={12} sm={8} md={10} lg={6} className="mt-1">
          {formstep === SIDE_MENU_ITEMS.info && <FormInfo relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.trade && <FormTrade relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.lend && <FormLend relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.deposit && <FormDeposit relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.transfer && <FormTransfer relayer={relayer} />}
          {formstep === SIDE_MENU_ITEMS.resign && <FormResign relayer={relayer} />}
        </Grid>
      )}
    </Grid>
  )
}

export default ConfigBoard

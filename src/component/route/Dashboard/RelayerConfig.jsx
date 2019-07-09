import React from 'react'
import {
  Grid,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core'
import FormInfo from './ConfigForms/FormInfo'
import FormTrade from './ConfigForms/FormTrade'
import FormTransfer from './ConfigForms/FormTransfer'
import FormResign from './ConfigForms/FormResign'


const ListItems = [
  'Information',
  'Trade Options',
  'Transfer',
  'Resign'
]

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
          {ListItems.map((item, idx) => (
            <ListItem key={item} button selected={formstep === idx} onClick={changeForm(idx)}>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Grid>
      {!relayer.coinbase ? <NotExistRelayer /> : (
        <Grid item md={9} className="mt-1">
          {formstep === 0 && <FormInfo relayer={relayer} />}
          {formstep === 1 && <FormTrade relayer={relayer} />}
          {formstep === 2 && <FormTransfer relayer={relayer} />}
          {formstep === 3 && <FormResign relayer={relayer} />}
        </Grid>
      )}
    </Grid>
  )
}

export default ConfigBoard

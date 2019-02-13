import * as _ from 'rambda'
import { withRouter } from 'react-router-dom'
import { connect } from 'redux-zero/react'
import { SITE_MAP } from '@constant'
import { Grid } from '@utility'
import ContractCard from './ContractCard'


const mapProps = store => ({
  contracts: store.contracts,
  relayers: store.relayers,
})

const connector = _.compose(
  withRouter,
  connect(mapProps),
)

@connector
export class Home extends React.Component {
  go = () => this.props.history.push(SITE_MAP.Dashboard)

  render() {
    const {
      contracts,
      relayers,
    } = this.props

    return (
      <div>
        <h2>
          Active Contracts
        </h2>
        <Grid className="align-center">
          {Object.keys(contracts).map(name => (
            <div className="col-6" key={contracts[name].address}>
              <ContractCard
                name={name}
                contract={contracts[name]}
              />
            </div>
          ))}
        </Grid>
      </div>
    )
  }
}

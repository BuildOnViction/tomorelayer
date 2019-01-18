import { connect } from 'redux-zero/react'
import { Grid } from '@utility'

const TableRow = ({ item }) => (
  <div className="relayer-table--row col-12 mr-1 ml-1">
    <Grid className="text-dark align-center">
      <div className="col-1">
        {item.id}
      </div>
      <div className="col-5">
        <Grid className="align-center">
          <div className="col-2 p-0 pl-1">
            <img alt={item.name} src={item.logo} className="relayer-logo" width="50" height="50" />
          </div>
          <div className="col-auto">
            {item.name}
          </div>
        </Grid>
      </div>
      <div className="col-5 text-blue text-bold">
        {item.address}
      </div>
    </Grid>
  </div>
)

class RelayerList extends React.Component {
  render() {
    return (
      <Grid className="relayer-table">
        <div className="relayer-table--head col-12 mr-1 ml-1">
          <Grid className="bg-blue text-white text-bold border-round-top">
            <div className="col-2">
              ID
            </div>
            <div className="col-5">
              Relayer Name
            </div>
            <div className="col-5">
              Address
            </div>
          </Grid>
        </div>
        {this.props.relayers.map((item, idx) => <TableRow key={item.name} item={item} />)}
      </Grid>
    )
  }
}

const connector = connect(store => ({
  relayers: store.relayers,
}))

export default connector(RelayerList)

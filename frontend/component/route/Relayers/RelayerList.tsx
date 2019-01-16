import { Grid } from '@utility'

const mock = [
  {
    id: 1,
    name: 'ABC',
    address: '0x123123123123',
    logo: 'https://placeimg.com/30/30/tech'
  },
  {
    id: 2,
    name: 'CDE',
    address: '0x123123123123',
    logo: 'https://placeimg.com/30/30/tech'
  },
  {
    id: 3,
    name: 'FGH',
    address: '0x123123123123',
    logo: 'https://placeimg.com/30/30/tech'
  },
  {
    id: 4,
    name: 'IJK',
    address: '0x123123123123',
    logo: 'https://placeimg.com/30/30/tech'
  },
]

const TableRow = ({ item }) => (
  <div className="relayer-table--row col-12 mr-1 ml-1">
    <Grid className="text-dark align-center">
      <div className="col-2">
        {item.id}
      </div>
      <div className="col-5">
        <Grid className="align-center">
          <div className="col-2 p-0">
            <img alt={item.name} src={item.logo} className="relayer-logo" />
          </div>
          <div className="col-auto">
            {item.name}
          </div>
        </Grid>
      </div>
      <div className="col-5">
        Address
      </div>
    </Grid>
  </div>
)

export default class RelayerList extends React.Component {
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
        {mock.map((item, idx) => <TableRow key={item.name} item={item} />)}
      </Grid>
    )
  }
}

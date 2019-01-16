const mock = [
  {
    name: 'ABC',
    address: '0x123123123123',
    logo: 'https://placeimg.com/50/50/tech'
  },
  {
    name: 'CDE',
    address: '0x123123123123',
    logo: 'https://placeimg.com/50/50/tech'
  },
  {
    name: 'FGH',
    address: '0x123123123123',
    logo: 'https://placeimg.com/50/50/tech'
  },
  {
    name: 'IJK',
    address: '0x123123123123',
    logo: 'https://placeimg.com/50/50/tech'
  },
]

export default class RelayerList extends React.Component {
  render() {
    return (
      <table className="bp3-html-table relayer-list">
        <thead className="relayer-list--head">
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Address</th>
          </tr>
        </thead>
        <tbody className="relayer-list--body">
          <tr>
            <td>Blueprint</td>
            <td>CSS framework and UI toolkit</td>
            <td>Sass, TypeScript, React</td>
          </tr>
          <tr>
            <td>TSLint</td>
            <td>Static analysis linter for TypeScript</td>
            <td>TypeScript</td>
          </tr>
          <tr>
            <td>Plottable</td>
            <td>Composable charting library built on top of D3</td>
            <td>SVG, TypeScript, D3</td>
          </tr>
        </tbody>
      </table>
    )
  }
}

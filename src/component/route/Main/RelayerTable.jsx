import React from 'react'
import {
  Grid,
  Paper,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const StyledPaper = withStyles(theme => ({
  root: {
    padding: 10,
    marginBottom: 15,
    paddingLeft: 20
  }
}))(Paper)

const TableHeads = [
  'Rank',
  'Relayers',
  'Trades (24h)',
  'Volumes ($)',
]

const mock = [
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
  { name: 'ABC', trades: 110, vol: 2000 },
]

export default class RelayerTable extends React.Component {

  componentDidMount() {
    // NOTE: Calculate volumes
  }

  render() {

    return (
      <Grid container direction="column">
        <Grid item container className="mb-1" className="p-1">
          {TableHeads.map(h => <Grid key={h} item sm={h === 'Rank' ? 2 : 3} container justify="center">{h}</Grid>)}
        </Grid>
        {mock.map((item, index) => (
          <Grid item key={index}>
            <StyledPaper elevation={0}>
              <Grid container>
                <Grid item sm={2} container justify="center">
                  {index}
                </Grid>
                {Object.values(item).map((t, idx) => (
                  <Grid item sm={3} key={idx} container justify="center">
                    {t}
                  </Grid>
                ))}
              </Grid>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
    )
  }
}

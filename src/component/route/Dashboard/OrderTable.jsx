import React from 'react'
import { format } from 'date-fns'
import {
  Grid,
  Paper,
  Hidden,
  withWidth,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'

const StyledPaper = withStyles(theme => ({
  root: {
    padding: 10,
    marginBottom: 15,
    paddingLeft: 20
  }
}))(Paper)

const Cell = withStyles(theme => ({
  root: {
    [theme.breakpoints.down('xs')]: {
      position: 'relative',
      paddingLeft: '50%',
      justifyContent: 'flex-start',
      '&:before': {
        content: 'attr(data-label)',
        position: 'absolute',
        left: 0,
        width: '47%',
        textAlign: 'right',
      },
    }
  }
}))(Grid)

const TableHeads = [
  'Date',
  'Maker Amount',
  'Taker Amount',
  'Fee',
]

const mock = [
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
  { date: format(Date.now(), 'D/MM/YY'), makerAmount: 110, takerAmount: 2000, Fee: 100 },
]

class OrderTable extends React.Component {

  componentDidMount() {
    // NOTE: Calculate volumes
  }

  render() {

    return (
      <Grid container direction="column">
        <Hidden xsDown>
          <Grid item container className="mb-1" className="p-1">
            {TableHeads.map(h => <Grid key={h} item sm={h === 'Rank' ? 2 : 3} container justify="center">{h}</Grid>)}
          </Grid>
        </Hidden>
        {mock.map((item, index) => (
          <Grid item key={index}>
            <StyledPaper elevation={0}>
              <Grid container>
                {Object.values(item).map((t, idx) => (
                  <Cell item sm={3} key={idx} data-label={TableHeads[idx]} container justify="center">
                    {t}
                  </Cell>
                ))}
              </Grid>
            </StyledPaper>
          </Grid>
        ))}
      </Grid>
    )
  }
}

const OrderTableResponsive = withWidth()(OrderTable)

export default OrderTableResponsive

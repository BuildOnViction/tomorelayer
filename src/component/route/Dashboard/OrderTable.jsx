import React from 'react'
import { format } from 'date-fns'
import {
  CircularProgress,
  Grid,
  Paper,
  Hidden,
  withWidth,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { round } from 'service/helper'
import Paginator from 'component/shared/Paginator'

const StyledPaper = withStyles(theme => ({
  root: {
    padding: 10,
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

class OrderTable extends React.Component {

  state = {
    currentPage: 0,
  }

  setPage = num => () => this.setState({ currentPage: this.state.currentPage + num })

  render() {

    const { data } = this.props
    const { currentPage } = this.state

    if (!data || !data.items) {
      return (
        <Grid container direction="column" justify="center">
          <CircularProgress style={{ width: 80, height: 80, margin: '10em auto' }} />
        </Grid>
      )
    }
    const slicedData = data.items.slice(currentPage * 10, (currentPage + 1) * 10)

    return (
      <Grid container direction="column">
        <Hidden xsDown>
          <Grid item container className="mb-1" className="p-1">
            <Grid sm="1" container justify="center">#</Grid>
            <Grid sm="3" container justify="center">Date</Grid>
            <Grid sm="3" container justify="center">Make Fee</Grid>
            <Grid sm="3" container justify="center">Take Fee</Grid>
            <Grid sm="2" container justify="center">Amount</Grid>
          </Grid>
        </Hidden>
        {slicedData.map((item, index) => (
          <Grid item key={index}>
            <StyledPaper elevation={0}>
              <Grid container>
                <Cell item sm={1} data-label="#" container justify="center">
                  {1 + index + currentPage * 10}
                </Cell>
                <Cell item sm={3} data-label="Date" container justify="center">
                  {format(new Date(item.updatedAt), 'DD MMM  YYYY')}
                </Cell>
                <Cell item sm={3} data-label="Maker Fee" container justify="center">
                  {round(item.makeFee, 5) + ` ${item.pairName.split('/')[0]}`}
                </Cell>
                <Cell item sm={3} data-label="Taker Fee" container justify="center">
                  {round(item.takeFee, 5) + ` ${item.pairName.split('/')[1]}`}
                </Cell>
                <Cell item sm={2} data-label="Fee" container justify="center">
                  {round(item.amount, 5)}
                </Cell>
              </Grid>
            </StyledPaper>
          </Grid>
        ))}
        <Paginator
          rowsPerPage={10}
          activePage={currentPage + 1}
          totalPages={data.total}
          onNext={this.setPage(1)}
          onPrev={this.setPage(-1)}
          onBegin={this.setPage(currentPage)}
          onEnd={this.setPage(Math.ceil(data.total / 10) - currentPage)}
        />
      </Grid>
    )
  }
}

const OrderTableResponsive = withWidth()(OrderTable)

export default OrderTableResponsive

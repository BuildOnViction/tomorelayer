import React from 'react'
import { format } from 'date-fns'
import {
  Box,
  CircularProgress,
  Grid,
  Paper,
  Hidden,
  Typography,
  withWidth,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { round } from 'service/helper'
import Paginator from 'component/shared/Paginator'
import { getTradesByCoinbase } from '../actions'

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
    currentPage: 1,
    items: [],
    pages: 0,
    perPage: 10,
    total: 0,
    error: false,
    loading: true,
  }

  async componentDidMount() {
    this.setExactPage(1)
  }

  setPage = num => () => this.setState({ currentPage: this.state.currentPage + num })

  setExactPage = async page => {
    const result = await getTradesByCoinbase(this.props.coinbase, page, this.state.perPage)
    if (!result) {
      return this.setState({ error: true, loading: false })
    }
    this.props.updateTotal(result.total)
    this.setState({ ...result, loading: false })
  }

  render() {

    const {
      currentPage,
      items,
      perPage,
      pages,
      loading,
    } = this.state

    if (loading) {
      return (
        <Grid container direction="column" justify="center">
          <CircularProgress style={{ width: 80, height: 80, margin: '10em auto' }} />
        </Grid>
      )
    }

    if (!loading && !items.length) {
      return (
        <Box>
          <Typography variant="body2" className="mt-3">
            No data to show
          </Typography>
        </Box>
      )
    }

    return (
      <Grid container direction="column" style={{ minHeight: '700px' }}>
        <Hidden xsDown>
          <Grid item container className="mb-1" className="p-1">
            <Grid item sm={1} container justify="center">#</Grid>
            <Grid item sm={3} container justify="center">Date</Grid>
            <Grid item sm={3} container justify="center">Trade Fee</Grid>
            <Grid item sm={3} container justify="center">Price</Grid>
            <Grid item sm={2} container justify="center">Amount</Grid>
          </Grid>
        </Hidden>
        {items.map((item, index) => (
          <Grid item key={index}>
            <StyledPaper elevation={0}>
              <Grid container>
                <Cell item sm={1} data-label="#" container justify="center">
                  {1 + index + (currentPage * 10 - 10)}
                </Cell>
                <Cell item sm={3} data-label="Date" container justify="center">
                  {format(new Date(item.updatedAt), 'DD MMM  YYYY')}
                </Cell>
                <Cell item sm={3} data-label="Trade Fee" container justify="center">
                  {round(item.makeFee, 5) + ` ${item.pairName.split('/')[1]}`}
                </Cell>
                <Cell item sm={3} data-label="Taker Fee" container justify="center">
                  {round(item.pricepoint, 5)}
                </Cell>
                <Cell item sm={2} data-label="Fee" container justify="center">
                  {round(item.amount, 5)}
                </Cell>
              </Grid>
            </StyledPaper>
          </Grid>
        ))}
        <Paginator
          rowsPerPage={perPage}
          activePage={currentPage}
          totalPages={pages}
          onNext={() => this.setExactPage(currentPage + 1)}
          onPrev={() => this.setExactPage(currentPage - 1)}
          onBegin={() => this.setExactPage(1)}
          onEnd={() => this.setExactPage(pages)}
          onPageClick={this.setExactPage}
        />
      </Grid>
    )
  }
}

const OrderTableResponsive = withWidth()(OrderTable)

export default OrderTableResponsive

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
  }

  setPage = num => () => this.setState({ currentPage: this.state.currentPage + num })

  setExactPage = async page => {
    if (page * 10 > this.props.data.items.length) {
      const apiPage = Math.ceil(page * 10 / 20)
      await this.props.requestData(apiPage)
    }
    this.setState({ currentPage: page })
  }

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

    const slicedData = data.items[currentPage]

    if (!slicedData.length) {
      return (
        <Box>
          <Typography variant="body2" className="mt-3">
            No data to show yet...
          </Typography>
        </Box>
      )
    }

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
                  {1 + index + (currentPage * 10 - 10)}
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
          activePage={currentPage}
          totalPages={data.total}
          onNext={this.setPage(1)}
          onPrev={this.setPage(-1)}
          onBegin={() => this.setExactPage(1)}
          onEnd={() => this.setExactPage(Math.ceil(data.total / 10))}
          onPageClick={this.setExactPage}
        />
      </Grid>
    )
  }
}

const OrderTableResponsive = withWidth()(OrderTable)

export default OrderTableResponsive

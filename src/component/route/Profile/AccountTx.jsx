import React from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
  Tabs,
  Tab,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { isEmpty } from 'service/helper'
import { fromWei } from 'service/blockchain'
import { ExternalLinks } from 'service/backend'
import { StyledLink } from 'component/shared/Adapters'
import Paginator from 'component/shared/Paginator'

const TableHeaders = [
  'Date',
  'From',
  'To',
  'Amount (TOMO)',
  'TxHash',
]

const TxTypes = {
  'deposit': 0,
  'withdrawal': 1,
}

const LimitedGridItem = withStyles(theme => ({
  root: {
    width: '20%',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    padding: '15px',
    color: theme.palette.primary,
    '&.table-header': {
      color: theme.palette.subtitle,
    },
    '&:first-child': {
      paddingLeft: 30,
    },
    '&:last-child': {
      paddingRight: 30,
    },
    '&.outlink': {
      color: theme.palette.link
    }
  }
}))(props => <Grid item {...props} />)

const GridRow = withStyles(theme => ({
  root: {
    '&.table-row:nth-child(odd)': {
      backgroundColor: theme.palette.evenRowBackground,
    },
  }
}))(Grid)

const TxTabs = withStyles(theme => ({
  root: {
    borderBottom: 'none',
  },
  indicator: {
    backgroundColor: 'initial',
  },
}))(Tabs)

const TxTab = withStyles(theme => ({
  root: {
    textTransform: 'capitalize',
    marginLeft: 0,
    marginRight: '30px',
    minWidth: 'initial',
    padding: 0,
  },
  selected: {
    color: theme.palette.maintitle,
  },
}))(props => <Tab {...props} />)

const TxTable = ({ txs }) => (
  <Paper elevation={0}>
    <Grid container direction="column" className="pb-1 pt-1">
      <Grid item container>
        {TableHeaders.map(h => (
          <LimitedGridItem key={h} className="table-header">
            {h}
          </LimitedGridItem>
        ))}
      </Grid>
      <Grid item container direction="column">
        {Object.values(txs).map(row => (
          <GridRow item key={row.hash} container className="table-row">
            <LimitedGridItem>
              {(row.timestamp || '').slice(0, 10)}
            </LimitedGridItem>
            <LimitedGridItem>
              {row.from}
            </LimitedGridItem>
            <LimitedGridItem>
              {row.to}
            </LimitedGridItem>
            <LimitedGridItem>
              {fromWei(row.value)}
            </LimitedGridItem>
            <LimitedGridItem className="outlink">
              <StyledLink href={ExternalLinks.transaction(row.hash)} underline="none" rel="noopener noreferrer" target="_blank">
                {row.hash}
              </StyledLink>
            </LimitedGridItem>
          </GridRow>
        ))}
      </Grid>
    </Grid>
  </Paper>
)


export default class AccountTx extends React.Component {
  state = {
    currentTab: TxTypes.deposit,
  }

  handleChangeTab = (_, newTab) => {
    this.setState({
      currentTab: newTab,
    })

    const { onTxTypeChange } = this.props
    onTxTypeChange(newTab === TxTypes.deposit ? 'in' : 'out')
  }

  render() {
    const {
      tx,
      onNext,
      onPrev,
      onBegin,
      onEnd,
    } = this.props

    const {
      currentTab,
    } = this.state

    if (isEmpty(tx.items || tx)) {
      return (
        <Box display="flex" flexDirection="column">
          <Typography component="h3">
            No transaction records
          </Typography>
        </Box>
      )
    }

    return (
      <Box display="flex" flexDirection="column">
        <TxTabs value={currentTab} onChange={this.handleChangeTab} aria-label="tx types">
          {Object.keys(TxTypes).map(type => <TxTab key={type} label={type} />)}
        </TxTabs>
        <TxTable txs={tx.items} />
        <Paginator
          rowsPerPage={tx.perPage}
          activePage={tx.currentPage}
          totalPages={tx.pages}
          onNext={onNext}
          onPrev={onPrev}
          onBegin={onBegin}
          onEnd={onEnd}
        />
      </Box>
    )
  }
}

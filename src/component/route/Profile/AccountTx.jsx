import React from 'react'
import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { isEmpty } from 'service/helper'
import { fromWei } from 'service/blockchain'
import { ExternalLinks } from 'service/backend'
import { CustomLink, StyledLink } from 'component/shared/Adapters'

const TableHeaders = [
  'Date',
  'From',
  'To',
  'Amount (TOMO)',
  'TxHash',
]

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

const TxTable = ({ txs }) => (
  <Paper elevation={0}>
    <Grid container direction="column" className="pb-1 pt-1">
      <Grid item container>
        {TableHeaders.map(h => <LimitedGridItem key={h} className="table-header">{h}</LimitedGridItem>)}
      </Grid>
      <Grid item container direction="column">
        {Object.values(txs).map(row => (
          <GridRow item key={row.hash} container className="table-row">
            <LimitedGridItem>
              {row.timestamp.slice(0, 10)}
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


const NoTx = () => (
  <React.Fragment>
    <Typography component="h3">
      No transaction records
    </Typography>
    <Typography component="div">
      Register a relayer <CustomLink to="/register">here</CustomLink>
    </Typography>
  </React.Fragment>
)


export default class AccountTx extends React.Component {

  render() {
    const {
      tx,
    } = this.props

    return (
      <Box display="flex" flexDirection="column">
        {isEmpty(tx.items || tx) ? (
          <NoTx />
        ) : (
          <React.Fragment>
            <Typography variant="body1" className="mb-1">
              Relayer Contract Transaction records
            </Typography>
            <TxTable txs={tx.items} />
          </React.Fragment>
        )}
      </Box>
    )
  }
}

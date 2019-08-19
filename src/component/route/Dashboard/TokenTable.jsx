import React from 'react'
import {
  Grid,
  Paper,
} from '@material-ui/core'
import { isEmpty } from 'service/helper'
import { SITE_MAP } from 'service/constant'
import { withStyles } from '@material-ui/core/styles'
import { ExternalLinks } from 'service/backend'
import {
  CustomLink,
  StyledLink,
} from 'component/shared/Adapters'

const StyledPaper = withStyles(theme => ({
  root: {
    padding: 10,
    marginBottom: 15,
    paddingLeft: 20
  }
}))(Paper)

const TableHeads = [
  'Name',
  'Symbol',
  'Address',
  'Trades',
]

const EmptyTokenTable = ({ coinbase }) => (
  <Grid container direction="column" className="mt-2">
    <Grid>You have yet to set any token for trading.</Grid>
    <Grid>Start adding some token <CustomLink to={`${SITE_MAP.Dashboard}/${coinbase}/config`}>here</CustomLink>...</Grid>
  </Grid>
)

const TokenTable = ({
  tokens,
  relayer,
}) => isEmpty(tokens) ? <EmptyTokenTable coinbase={relayer.coinbase} /> : (
  <Grid container direction="column">
    <Grid item container className="mb-1" className="p-1">
      {TableHeads.map(h => <Grid key={h} item sm={h === 'Rank' ? 2 : 3} container justify="center">{h}</Grid>)}
    </Grid>
    {tokens.map((item, index) => (
      <Grid item key={index}>
        <StyledPaper elevation={0}>
          <Grid container>
            <Grid item sm={3} container justify="center">{item.name}</Grid>
            <Grid item sm={3} container justify="center">{item.symbol}</Grid>
            <Grid item sm={3} container justify="center">
              <StyledLink
                href={ExternalLinks.token(item.address)}
                rel="noopener noreferrer"
                target="_blank"
                className="m-0"
                style={{ lineHeight: '19px' }}
              >
                {item.address}
              </StyledLink>
            </Grid>
          </Grid>
        </StyledPaper>
      </Grid>
    ))}
  </Grid>
)

export default TokenTable

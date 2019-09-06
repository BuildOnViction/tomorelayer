import React from 'react'
import {
  Grid,
  Paper,
} from '@material-ui/core'
import faker from 'faker'
import { withStyles } from '@material-ui/core/styles'
import { isEmpty } from 'service/helper'
import { SITE_MAP } from 'service/constant'
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
  'Rank',
  'Token',
  'Price ($)',
  'Trades (24h)',
  'Volumes ($)',
]

const EmptyTokenTable = ({ coinbase }) => (
  <Grid container direction="column" className="mt-2">
    <Grid>You have yet to set any token for trading.</Grid>
    <Grid>Start adding some token <CustomLink to={`${SITE_MAP.Dashboard}/${coinbase}/config`}>here</CustomLink>...</Grid>
  </Grid>
)

const TokenTable = ({
  tokens = [],
  relayer = {},
}) => {

  const headerWith = title => {
    switch (title) {
      case 'Rank':
        return 1
      case 'Volumes ($)':
        return 5
      default:
        return 2
    }
  }

  return isEmpty(tokens) ? <EmptyTokenTable coinbase={relayer.coinbase} /> : (
    <Grid container direction="column">
      <Grid item container className="mb-1" className="p-1">
        {TableHeads.map(h => <Grid key={h} item xs={headerWith(h)} container justify="center">{h}</Grid>)}
      </Grid>
      {tokens.map((item, index) => (
        <Grid item key={index}>
          <StyledPaper elevation={0}>
            <Grid container>
              <Grid item xs={1} container justify="center">{index}</Grid>
              <Grid item xs={2} container justify="center">
                <StyledLink
                  href={ExternalLinks.token(item.address)}
                  rel="noopener noreferrer"
                  target="_blank"
                  className="m-0"
                  style={{ lineHeight: '19px' }}
                >
                  {item.symbol}
                </StyledLink>
              </Grid>
              <Grid item xs={2} container justify="center">
                {faker.random.number()}
              </Grid>
              <Grid item xs={2} container justify="center">
                {faker.random.number()}
              </Grid>
              <Grid item xs={5} container justify="center">
                {faker.random.number()}
              </Grid>
            </Grid>
          </StyledPaper>
        </Grid>
      ))}
    </Grid>
  )
}

export default TokenTable
